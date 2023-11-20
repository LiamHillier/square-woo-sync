<?php

namespace Pixeldev\SWS\REST;

use Error;
use Pixeldev\SWS\Abstracts\RESTController;
use Pixeldev\SWS\Square\SquareInventory;
use Pixeldev\SWS\Square\SquareHelper;
use Pixeldev\SWS\Square\SquareImport;
use WP_REST_Server;
use WP_REST_Response;
use WP_REST_Request;
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
                'callback' => [$this, 'import_to_woocommerce'],
                'permission_callback' => [$this, 'check_permission']
            ]
        ]);
    }

    private function get_token_and_validate()
    {
        $squareInv = new SquareInventory();
        $token = $squareInv->get_access_token();

        if (!$token) {
            return new WP_Error(401, 'Access token not set');
        }

        $square = new SquareHelper($token);
        if (!$square->isTokenValid()) {
            return new WP_Error(401, 'Invalid access token');
        }

        return $square;
    }

    /**
     * Retrieve woocommerce products
     *
     * @return array
     */
    public function get_woocommerce_products()
    {
        $args = [
            'status' => 'publish',
            'limit' => -1, // Consider adding a limit or pagination for performance
            'type' => ['simple', 'variable'],
        ];

        $products = wc_get_products($args);
        $product_data = [];

        foreach ($products as $product) {
            $product_data[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'sku' => $product->get_sku(),
            ];

            // Include variation SKUs for variable products
            if ($product->is_type('variable')) {
                foreach ($product->get_children() as $child_id) {
                    $variation = wc_get_product($child_id);
                    $product_data[] = [
                        'id' => $variation->get_id(),
                        'name' => $variation->get_name(),
                        'sku' => $variation->get_sku(),
                    ];
                }
            }
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
        $matchedSKUs = array_column($woocommerceProducts, 'sku');
        $categories = $square->getAllSquareCategories();
        $result = [];

        foreach ($squareInventory as $squareItem) {
            $itemData = json_decode(json_encode($squareItem), true);

            if (isset($itemData['item_data']['category_id']) && isset($categories[$itemData['item_data']['category_id']])) {
                $itemData['item_data']['category_name'] = $categories[$itemData['item_data']['category_id']];
            }

            $parentSku = isset($itemData['item_data']['variations'][0]['item_variation_data']['sku']) ? $itemData['item_data']['variations'][0]['item_variation_data']['sku'] . '-sws' : null;
            $itemData['imported'] = $parentSku && in_array($parentSku, $matchedSKUs);

            if (isset($itemData['item_data']['variations'])) {
                foreach ($itemData['item_data']['variations'] as &$variation) {
                    $variation['imported'] = false;
                    $variationSku = isset($variation['item_variation_data']['sku']) ? $variation['item_variation_data']['sku'] : null;
                    if ($variationSku && in_array($variationSku, $matchedSKUs)) {
                        $variation['imported'] = true;
                    }
                }
                unset($variation);
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
        $square = $this->get_token_and_validate();
        if (is_wp_error($square)) {
            return rest_ensure_response($square);
        }

        try {
            $squareInv = new SquareInventory();
            $token = $squareInv->get_access_token();
            if ($token) {
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


    /**
     * Handles GET requests for inventory.
     *
     * @return WP_REST_Response
     */
    public function import_to_woocommerce(WP_REST_Request $request): WP_REST_Response
    {
        $square = $this->get_token_and_validate();
        if (is_wp_error($square)) {
            return rest_ensure_response($square);
        }
        $product =  $request->get_param('product');

        $squareImport = new SquareImport();
        $token = $squareImport->get_access_token();
        if ($token) {
            $square = new SquareHelper($token);
            $isValidToken = $square->isTokenValid();
            if (!$isValidToken) {

                return rest_ensure_response(new WP_Error(401, 'Invalid access token'));
            } else {
                $wooProduct = $squareImport->import_products(array($product));
                return rest_ensure_response($wooProduct);
            }
        } else {
            return rest_ensure_response(new WP_Error(401, 'Access token not set'));
        }

        return rest_ensure_response(new WP_Error(401, 'Cant find access token'));
    }
}
