<?php

namespace Pixeldev\SWS\REST;

use Pixeldev\SWS\Abstracts\RESTController;
use Pixeldev\SWS\Square\SquareInventory;
use Pixeldev\SWS\Square\SquareHelper;
use Pixeldev\SWS\Square\SquareImport;
use WP_REST_Server;
use WP_REST_Response;
use WP_REST_Request;
use WP_Error;
use Exception;


class SquareController extends RESTController
{
    /**
     * Endpoint namespace.
     *
     * @var string
     */
    protected $namespace = 'sws/v1';

    /**
     * Route base.
     *
     * @var string
     */
    protected $base = 'square-inventory';

    /**
     * Registers the routes for handling inventory.
     *
     * @return void
     */
    public function register_routes()
    {
        register_rest_route($this->namespace, '/' . $this->base, [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_square_inventory'],
                'permission_callback' => [$this, 'check_permission']
            ]
        ]);
        register_rest_route($this->namespace, '/' . $this->base . '/import', [
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'import_to_woocommerce'],
                'permission_callback' => [$this, 'check_permission']
            ]
        ]);
    }

    private function get_token_and_validate()
    {
        $square = new SquareHelper();
        $token = $square->get_access_token();

        if (!$token) {
            return new WP_Error(401, 'Access token not set');
        }

        if (!$square->isTokenValid()) {
            return new WP_Error(401, 'Invalid access token');
        }

        return $token;
    }


    /**
     * Retrieve WooCommerce product data with minimal memory usage.
     *
     * @return array
     */
    public function get_woocommerce_products()
    {
        global $wpdb;

        $query = "SELECT p.ID, p.post_title AS name, meta1.meta_value AS sku
              FROM {$wpdb->prefix}posts AS p
              LEFT JOIN {$wpdb->prefix}postmeta AS meta1 ON (p.ID = meta1.post_id AND meta1.meta_key = '_sku')
              WHERE p.post_type IN ('product', 'product_variation')
              AND p.post_status = 'publish'
              ORDER BY p.ID";

        $results = $wpdb->get_results($query, ARRAY_A);

        return $results;
    }


    /**
     * Compares Square SKU with Woocommerce SKU for matching purposes
     *
     * @return array
     */
    private function compare_skus($squareInventory, $woocommerceProducts, $square)
    {
        error_log('comparing');
        $categories = $square->getAllSquareCategories();
        $result = [];
        error_log('got categories');
        foreach ($squareInventory as $squareItem) {
            $itemData = json_decode(json_encode($squareItem), true);

            if (isset($itemData['item_data']['category_id']) && isset($categories[$itemData['item_data']['category_id']])) {
                $itemData['item_data']['category_name'] = $categories[$itemData['item_data']['category_id']];
            }

            $skuMapping = [];
            $parentSku = isset($itemData['item_data']['variations'][0]['item_variation_data']['sku']) ? $itemData['item_data']['variations'][0]['item_variation_data']['sku'] : null;

            // Create a mapping of WooCommerce product SKUs to WooCommerce product IDs
            foreach ($woocommerceProducts as $wcProduct) {
                $wcSku = $wcProduct['sku'] ?? null;
                $wcProductId = $wcProduct['id'] ?? null;

                if ($wcSku && $wcProductId) {
                    $skuMapping[$wcSku] = $wcProductId;
                }
            }

            // Check if the parent SKU is in the matched SKUs and add WooCommerce product ID
            $itemData['imported'] = false;
            if ($parentSku && isset($skuMapping[$parentSku])) {
                $itemData['imported'] = true;
                $itemData['woocommerce_product_id'] = $skuMapping[$parentSku];
            }

            if (isset($itemData['item_data']['variations'])) {
                foreach ($itemData['item_data']['variations'] as &$variation) {
                    $variationSku = isset($variation['item_variation_data']['sku']) ? $variation['item_variation_data']['sku'] : null;

                    // Check for each variation SKU and add WooCommerce product ID
                    $variation['imported'] = false;
                    if ($variationSku && isset($skuMapping[$variationSku])) {
                        $variation['imported'] = true;
                        $variation['woocommerce_product_id'] = $skuMapping[$variationSku];
                    }
                }
                unset($variation); // Break the reference with the last element
            }

            $result[] = $itemData;
        }

        return $result;
    }







    /**
     * Handles GET requests for inventory.
     *
     * @return WP_REST_Response
     */
    public function get_square_inventory()
    {
        $token = $this->get_token_and_validate();
        if (is_wp_error($token)) {
            return rest_ensure_response(new WP_Error(401, 'Invalid access token'));
        }

        try {
            $squareInv = new SquareInventory();
            if ($token) {
                $inventory = $squareInv->retrieve_inventory();
                error_log('inventory received');
                // Additional logic to process or format the inventory data
                //     -- Get images from square
                // Retrieve WooCommerce products
                $woocommerceProducts = $this->get_woocommerce_products();
                $matches = $this->compare_skus($inventory, $woocommerceProducts, $squareInv);
                return rest_ensure_response($matches);
            } else {
                return rest_ensure_response(new WP_Error(401, 'Access token not set'));
            }
        } catch (\Exception $e) {
            // Error handling logic
            return rest_ensure_response(new WP_Error(500, 'square_inventory_error', $e->getMessage()));
        }
    }


    /**
     * Handles GET requests for inventory.
     *
     * @return WP_REST_Response
     */
    public function import_to_woocommerce(WP_REST_Request $request): WP_REST_Response
    {
        $token = $this->get_token_and_validate();
        if (is_wp_error($token)) {
            return rest_ensure_response(new WP_Error(401, 'Invalid access token'));
        }

        $product =  $request->get_param('product');
        $dataToImport =  $request->get_param('datatoimport');


        $squareImport = new SquareImport();

        if ($token) {
            $wooProduct = $squareImport->import_products($product, $dataToImport);
            return rest_ensure_response($wooProduct);
        } else {
            return rest_ensure_response(new WP_Error(401, 'Access token not set'));
        }
        return rest_ensure_response(new WP_Error(401, 'Cant find access token'));
    }
}
