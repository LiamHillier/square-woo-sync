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
        $routes = [
            ['', WP_REST_Server::READABLE, 'get_square_inventory'],
            ['/import', WP_REST_Server::EDITABLE, 'import_to_woocommerce'],
            ['/update', WP_REST_Server::EDITABLE, 'receive_square_update']
        ];

        foreach ($routes as $route) {
            register_rest_route($this->namespace, '/' . $this->base . $route[0], [
                'methods' => $route[1],
                'callback' => [$this, $route[2]],
                'permission_callback' => [$this, 'check_permission']
            ]);
        }
    }

    public function receive_square_update(WP_REST_Request $request)
    {
        $this->acknowledge_receipt();
        $body = json_decode($request->get_body(), true);
        error_log($request->get_body());
        // Check the event type
        $eventType = $body['type'] ?? '';
        switch ($eventType) {
            case 'inventory.count.updated':
                $this->handle_inventory_count_updated($body);
                break;
            case 'catalog.version.updated':
                $this->handle_catalog_version_updated($body);
                break;
            default:
                // Handle unknown event type
                error_log('Received unknown event type: ' . $eventType);
                break;
        }
    }

    private function acknowledge_receipt()
    {
        status_header(200);
        echo 'Event Received';
    }

    private function handle_catalog_version_updated($data)
    {
        try {
            $updated_at = new \DateTime($data['data']['object']['catalog_version']['updated_at']);
            $updated_at->modify('-1 millisecond');
            $beginTime = $updated_at->format(\DateTime::ATOM);

            $requestBody = [
                'object_types' => ['ITEM'],
                'include_deleted_objects' => false,
                'include_related_objects' => false,
                'begin_time' => $beginTime
            ];

            $square = new SquareHelper();
            $response = $square->squareApiRequest('/catalog/search', 'POST', $requestBody);

            if (isset($response) && $response['success'] === true) {
                $squareImport = new SquareImport();
                $squareInventory = new SquareInventory();
                $dataToImport = ['sku' => true, 'title' => true, 'description' => true, 'stock' => false, 'price' => true, 'categories' => true, 'image' => true];
                $categories = $squareInventory->getAllSquareCategories();

                foreach ($response['data']['objects'] as &$product) {

                    $this->processProductVariations($product, $square);

                    if (!empty($product['item_data']['image_ids'])) {
                        // Process image URLs one by one instead of pre-fetching all
                        $product['item_data']['image_urls'] = [];
                        foreach ($product['item_data']['image_ids'] as $id) {
                            $product['item_data']['image_urls'][] = $squareInventory->fetchImageURL($id);
                        }
                    }

                    if (isset($product['item_data']['category_id']) && isset($categories[$product['item_data']['category_id']])) {
                        $product['item_data']['category_name'] = $categories[$product['item_data']['category_id']];
                    }
                }
                unset($product);

                $importResults = $squareImport->import_products($response['data']['objects'], $dataToImport, true);
                error_log(json_encode($importResults));
            } else {
                error_log("Square API request failed: " . ($response['error'] ?? 'Unknown error'));
            }
        } catch (\Exception $e) {
            error_log("Error in updating product via webhook: " . $e->getMessage());
        }
    }



    private function processProductVariations(&$product, $square)
    {
        foreach ($product['item_data']['variations'] as &$variation) {
            if (isset($variation['item_variation_data']['item_option_values'])) {
                $newOptionValues = [];
                foreach ($variation['item_variation_data']['item_option_values'] as $option) {
                    $optionName = $this->fetchOptionName($square, $option['item_option_id']);
                    $optionValue = $this->fetchOptionValue($square, $option['item_option_value_id']);

                    $newOptionValues[] = [
                        "optionName" => $optionName,
                        "optionValue" => $optionValue
                    ];
                }
                $variation['item_variation_data']['item_option_values'] = $newOptionValues;
            }
        }
        unset($variation);
    }

    private function fetchOptionName($square, $optionId)
    {
        $optionNameRequest = $square->squareApiRequest('/catalog/object/' . $optionId . '?include_related_objects=false');
        return $optionNameRequest['success'] === true ? $optionNameRequest['data']['object']['item_option_data']['name'] : null;
    }

    private function fetchOptionValue($square, $optionValueId)
    {
        $optionValueRequest = $square->squareApiRequest('/catalog/object/' . $optionValueId . '?include_related_objects=false');
        return $optionValueRequest['success'] === true ? $optionValueRequest['data']['object']['item_option_value_data']['name'] : null;
    }


    private function handle_inventory_count_updated($data)
    {
        $catalogObjectId = $data['data']['object']['inventory_counts'][0]['catalog_object_id'] ?? '';
        $square = new SquareHelper();
        $squareItemDetails = $square->getSquareItemDetails($catalogObjectId);

        if ($squareItemDetails) {
            $wooProducts = $this->get_woocommerce_products();

            foreach ($wooProducts as $wcProduct) {
                $wcSquareProductId = $wcProduct['square_product_id'] ?? null;
                $wcProductId = $wcProduct['ID'] ?? null;
                if ($wcProductId) {
                    $product = wc_get_product($wcProductId);
                    $id = $squareItemDetails['object']['id'];
                    if ($product->is_type('simple')) {
                        $id = $squareItemDetails['object']['item_variation_data']['item_id'];
                    }
                    if ($wcSquareProductId && $wcSquareProductId === $id) {
                        error_log($wcProductId);
                        if (is_a($product, 'WC_Product')) {
                            $newQuantity = $data['data']['object']['inventory_counts'][0]['quantity'];
                            $product->set_stock_quantity($newQuantity);
                            $product->save();
                        } else {
                            error_log('No square product match found for ID: ' . $wcProductId);
                        }

                        break; // Exit the loop once a match is found
                    }
                } else {
                    error_log('No WooCommerce product found for ID: ' . $wcProductId);
                }
            }

            // Free memory by unsetting unnecessary variables
            unset($wooProducts);
        } else {
            error_log('Failed to fetch details for Square ID: ' . $catalogObjectId);
        }
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

        $query = "SELECT p.ID, p.post_title AS name, meta1.meta_value AS sku, meta2.meta_value AS square_product_id
              FROM {$wpdb->prefix}posts AS p
              LEFT JOIN {$wpdb->prefix}postmeta AS meta1 ON (p.ID = meta1.post_id AND meta1.meta_key = '_sku')
              LEFT JOIN {$wpdb->prefix}postmeta AS meta2 ON (p.ID = meta2.post_id AND meta2.meta_key = 'square_product_id')
              WHERE p.post_type IN ('product', 'product_variation')
              AND p.post_status = 'publish'
              ORDER BY p.ID";

        return $wpdb->get_results($query, ARRAY_A);
    }

    /**
     * Compares Square SKU with WooCommerce SKU for matching purposes and updates the import status.
     *
     * @param array $squareInventory
     * @param array $woocommerceProducts
     * @param object $square
     * @return array
     */
    private function compare_skus($squareInventory, $woocommerceProducts, $square)
    {
        $categories = $square->getAllSquareCategories();
        $result = [];
        // Create a mapping of WooCommerce square_product_id to WooCommerce product IDs
        $squareProductIdMapping = [];
        foreach ($woocommerceProducts as $wcProduct) {
            $wcSquareProductId = $wcProduct['square_product_id'] ?? null;
            $wcProductId = $wcProduct['ID'] ?? null;

            if ($wcSquareProductId && $wcProductId) {
                $squareProductIdMapping[$wcSquareProductId] = $wcProductId;
            }
        }

        foreach ($squareInventory as $squareItem) {
            $itemData = $squareItem;


            if (isset($itemData['item_data']['category_id']) && isset($categories[$itemData['item_data']['category_id']])) {
                $itemData['item_data']['category_name'] = $categories[$itemData['item_data']['category_id']];
            }

            $squareProductId = $itemData['id'] ?? null;

            // Check if the Square product ID is in the matched square_product_id and add WooCommerce product ID
            $itemData['imported'] = false;
            if ($squareProductId && isset($squareProductIdMapping[$squareProductId])) {
                $itemData['imported'] = true;
                $itemData['woocommerce_product_id'] = $squareProductIdMapping[$squareProductId];
            }

            if (isset($itemData['item_data']['variations'])) {
                foreach ($itemData['item_data']['variations'] as &$variation) {
                    $variationId = $variation['id'] ?? null;

                    // Check if the Square variation ID is in the matched square_product_id and add WooCommerce product ID
                    $variation['imported'] = false;
                    if ($variationId && isset($squareProductIdMapping[$variationId])) {
                        $variation['imported'] = true;
                        $variation['woocommerce_product_id'] = $squareProductIdMapping[$variationId];
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
