<?php

namespace Pixeldev\SWS\REST;

use Pixeldev\SWS\Abstracts\RESTController;
use Pixeldev\SWS\Square\SquareInventory;
use Pixeldev\SWS\Square\SquareHelper;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;


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
                'callback' => [$this, 'import'],
                'permission_callback' => [$this, 'check_permission']
            ]
        ]);
    }



    /**
     * Retrieve woocommerce products
     *
     * @return array
     */
    public function get_woocommerce_products()
    {
        $args = array(
            'status' => 'publish',
            'limit' => -1, // Use -1 to fetch all products, or set a specific number
        );

        $products = wc_get_products($args);

        $product_data = array();
        foreach ($products as $product) {
            $product_data[] = array(
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'sku' => $product->get_sku(),
                // Add any other product properties you need
            );
        }

        return $product_data;
    }



    /**
     * Compares Square SKU with Woocommerce SKU for matching purposes
     *
     * @return array
     */
    private function compare_skus($squareInventory, $woocommerceProducts, $square)
    {
        $matchedSKUs = array_column($woocommerceProducts, 'sku'); // Extract SKUs from WooCommerce products
        $categories = $square->getAllSquareCategories(); // Get all Square categories
        $result = [];

        foreach ($squareInventory as $squareItem) {
            // Convert the Square item object to an associative array
            $itemData = json_decode(json_encode($squareItem), true);

            // Retrieve and add category name
            if (isset($itemData['item_data']['category_id']) && isset($categories[$itemData['item_data']['category_id']])) {
                $itemData['item_data']['category_name'] = $categories[$itemData['item_data']['category_id']];
            }

            // Check for variations and SKUs
            if (isset($itemData['item_data']['variations'])) {
                foreach ($itemData['item_data']['variations'] as &$variation) {
                    // Initially set 'imported' to false for each variation
                    $variation['imported'] = false;

                    if (isset($variation['item_variation_data']['sku']) && in_array($variation['item_variation_data']['sku'], $matchedSKUs)) {
                        $variation['imported'] = true; // Set 'imported' to true if SKU matches
                    }
                }
                unset($variation); // Unset reference to the last element
            }

            // Add the modified item data to the result array
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
        try {


            $squareInv = new SquareInventory();
            $token = $squareInv->get_access_token();
            if ($token) {
                $square = new SquareHelper($token);
                $isValidToken = $square->isTokenValid();
                if (!$isValidToken) {
                    return rest_ensure_response(new WP_Error(401, 'Invalid access token'));
                } else {
                    $inventory = $squareInv->retrieve_inventory();
                    // Additional logic to process or format the inventory data
                    //     -- Get images from square
                    // Retrieve WooCommerce products
                    $woocommerceProducts = $this->get_woocommerce_products();
                    $matches = $this->compare_skus($inventory, $woocommerceProducts, $squareInv);


                    return rest_ensure_response($matches);
                }
            } else {
                return rest_ensure_response(new WP_Error(401, 'Access token not set'));
            }
        } catch (\Exception $e) {
            // Error handling logic
            return rest_ensure_response(new WP_Error(500, 'square_inventory_error', $e->getMessage()));
        }
    }
}
