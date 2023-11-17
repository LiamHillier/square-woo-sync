<?php

namespace Pixeldev\SWS\Square;

use Pixeldev\SWS\Square\SquareHelper;
use Square\SquareClient;
use Square\Environment;
use WooCommerce\WC_Product_Simple;

class SquareImport
{

    private $client;
    public function __construct()
    {
        $token = $this->get_access_token();
        $this->client = new SquareClient([
            'accessToken' => $token,
            'environment' => Environment::SANDBOX, // or ::PRODUCTION
        ]);
    }

    public function get_access_token()
    {
        $settings = get_option('sws_settings', []);
        $token = isset($settings['access_token']) ? $settings['access_token'] : null;

        if ($token) {
            $squareHelper = new SquareHelper($token);
            $decryptedToken = $squareHelper->decrypt_access_token($token);
            return $decryptedToken;
        }

        return null;
    }


    public function import_products()
    {
        // Fetch products from Square
        $square_products = $this->fetch_square_products();

        // Iterate over each Square product
        foreach ($square_products as $square_product) {
            // Map the Square product to a WooCommerce product format
            $wc_product_data = $this->map_square_product_to_woocommerce($square_product);
            // Create or update the WooCommerce product
            $this->create_or_update_woocommerce_product($wc_product_data);
        }
    }


    private function fetch_square_products()
    {


        // Create an instance of the Catalog API
        $catalogApi =  $this->client->getCatalogApi();


        // Fetch list of products (catalog items) from Square
        $cursor = null;
        $square_products = [];

        do {
            $apiResponse = $catalogApi->listCatalog($cursor, 'ITEM');

            if ($apiResponse->isSuccess()) {
                $listCatalogResponse = $apiResponse->getResult();
                $items = $listCatalogResponse->getObjects();
                $square_products = array_merge($square_products, $items);
                $cursor = $listCatalogResponse->getCursor();
            } else {
                error_log('Error fetching Square catalog page: ' . json_encode($apiResponse->getErrors()));
            }
        } while ($cursor);

        return $square_products;
    }

    private function map_square_product_to_woocommerce($square_product)
    {
        $wc_product_data = [];

        // Check if the product is of type ITEM
        if ($square_product->getType() != 'ITEM') {
            // If not an ITEM, return empty data or handle accordingly
            return $wc_product_data;
        }

        // Accessing ITEM specific data
        $item_data = $square_product->getItemData();

        // Basic product details
        $wc_product_data['name'] = $item_data->getName();
        $wc_product_data['description'] = $item_data->getDescription();
        $wc_product_data['type'] = count($item_data->getVariations()) > 1 ? 'variable' : 'simple';

        // Pricing, SKU, and variations for variable products
        if ($wc_product_data['type'] === 'variable') {
            $wc_product_data['variations'] = [];
            foreach ($item_data->getVariations() as $variation) {
                $variation_data = [
                    'name' => $variation->getItemVariationData()->getName(),
                    'sku' => $variation->getItemVariationData()->getSku(),
                    'price' => $variation->getItemVariationData()->getPriceMoney()->getAmount() / 100, // Convert to decimal
                    // Add more variation-specific details here
                ];
                $wc_product_data['variations'][] = $variation_data;
            }
        } else {
            // Pricing for simple products
            if (!empty($item_data->getVariations())) {
                $first_variation = $item_data->getVariations()[0];
                $wc_product_data['sku'] = $first_variation->getItemVariationData()->getSku();
                $wc_product_data['regular_price'] = $first_variation->getItemVariationData()->getPriceMoney()->getAmount() / 100; // Convert to decimal
            }
        }

        // Additional mappings can be added as needed (e.g., categories, images, etc.)

        return $wc_product_data;
    }

    private function create_or_update_woocommerce_product($wc_product_data)
    {
        if (isset($wc_product_data['sku'])) {
            // Check if a product with the given SKU already exists in WooCommerce
            $product_id = wc_get_product_id_by_sku($wc_product_data['sku']);

            if ($product_id) {
                // Update existing product
                $product = wc_get_product($product_id);
            } else {
                // Create new product
                if ($wc_product_data['type'] === 'simple') {
                    $product = new \WC_Product_Simple();
                } elseif ($wc_product_data['type'] === 'variable') {
                    $product = new \WC_Product_Variable();
                } else {
                    // Handle other product types if necessary
                    return;
                }
            }

            // Set common product properties
            $product->set_name($wc_product_data['name']);
            $product->set_description($wc_product_data['description']);
            // Set more properties as needed (e.g., categories, images, etc.)

            // Handle variations for variable products
            if ($wc_product_data['type'] === 'variable') {
                foreach ($wc_product_data['variations'] as $variation_data) {
                    $variation = new WC_Product_Variation();
                    $variation->set_sku($variation_data['sku']);
                    $variation->set_regular_price($variation_data['price']);
                    // Set more variation properties as needed

                    $product->add_child($variation);
                }
            } else {
                // Set pricing for simple products
                $product->set_regular_price($wc_product_data['regular_price']);
            }

            // Save the product
            $product->save();

            // Additional handling for variations of variable products
            if ($wc_product_data['type'] === 'variable') {
                foreach ($product->get_children() as $child_id) {
                    $variation = new WC_Product_Variation($child_id);
                    // Set or update additional variation data if needed
                    $variation->save();
                }
            }
        }
    }

    // Additional methods for handling product variations, attributes, etc.
}
