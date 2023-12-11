<?php

namespace Pixeldev\SWS\Square;

use Pixeldev\SWS\Square\SquareHelper;
use Pixeldev\SWS\Woo\CreateProduct;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Class responsible for importing products from Square to WooCommerce.
 */
class SquareImport extends SquareHelper
{

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Imports products from Square to WooCommerce.
     *
     * @param array $square_products Products to import.
     * @param array $data_to_import Data to be imported.
     * @param bool $update_only Flag to update existing products only.
     * @return array Results of the import process.
     */
    public function import_products($square_products, $data_to_import, $update_only = false)
    {
        $results = [];

        foreach ($square_products as $square_product) {
            try {
                $create_product = new CreateProduct();
                $wc_product_data = $this->map_square_product_to_woocommerce($square_product);
                $product_id = $create_product->create_or_update_product($wc_product_data, $data_to_import, $update_only);

                if (false !== $product_id) {
                    $results[] = ['status' => 'success', 'product_id' => $product_id, 'square_id' => $square_product['id'], 'message' => 'Product imported successfully'];
                } else {
                    $results[] = ['status' => 'failed', 'product_id' => null, 'square_id' => $square_product['id'], 'message' => 'Failed to import product'];
                }
            } catch (\Exception $e) {
                error_log('Error importing product: ' . $e->getMessage());
                $results[] = ['status' => 'failure', 'product_id' => null, 'message' => 'Exception occurred: ' . $e->getMessage()];
            }
        }

        return $results;
    }

    /**
     * Maps a Square product to a WooCommerce product format.
     *
     * @param array $square_product The Square product to map.
     * @return array The WooCommerce product data.
     */
    private function map_square_product_to_woocommerce($square_product)
    {
        error_log(json_encode($square_product));

        $wc_product_data = [];

        // Map basic product details from Square to WooCommerce
        $wc_product_data['name'] = $square_product['item_data']['name'];
        $wc_product_data['description'] = $square_product['item_data']['description'] ?? '';
        $wc_product_data['type'] = count($square_product['item_data']['variations']) > 1 ? 'variable' : 'simple';
        $wc_product_data['sku'] = $square_product['item_data']['variations'][0]['item_variation_data']['sku'];

        $wc_product_data['square_product_id'] = $square_product['id'];

        $category_name = isset($square_product['item_data']['category_name']) ? sanitize_text_field($square_product['item_data']['category_name']) : '';
        $wc_product_data['category'] = $category_name;


        // Map pricing, SKU, and variations for variable products
        $wc_product_data['variations'] = [];
        foreach ($square_product['item_data']['variations'] as $variation) {
            $variation_data = [
                'name' => $variation['item_variation_data']['name'],
                'sku' => $variation['item_variation_data']['sku'],
                'price' => $variation['item_variation_data']['price_money']['amount'] / 100,
                'attributes' => [],
                'stock' => intval($variation['inventory_count'] ?? 0),
                'variation_square_id' => $variation['id']
            ];

            if (isset($variation['item_variation_data']['item_option_values'])) {
                foreach ($variation['item_variation_data']['item_option_values'] as $option) {
                    $variation_data['attributes'][] = [
                        'name' => $option['optionName'],
                        'option' => $option['optionValue']
                    ];
                }
            }

            $wc_product_data['variations'][] = $variation_data;
        }


        $wc_product_data['stock'] = intval($square_product['item_data']['variations'][0]['inventory_count'] ?? '0');
        $wc_product_data['price'] = $square_product['item_data']['variations'][0]['item_variation_data']['price_money']['amount'] / 100;


        if (!empty($square_product['item_data']['image_urls']) && !empty($square_product['item_data']['image_ids'])) {
            // Handle Multiple Image Imports
            $image_urls = $square_product['item_data']['image_urls'];
            $square_image_ids = $square_product['item_data']['image_ids'];

            // Instead of importing images here, just store the image URLs and Square image IDs
            $wc_product_data['images'] = array_combine($square_image_ids, $image_urls);
        }

        return $wc_product_data;
    }
}
