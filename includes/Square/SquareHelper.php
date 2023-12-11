<?php

namespace Pixeldev\SWS\Square;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Helper class for handling Square API requests.
 */
class SquareHelper
{
    private $access_token;
    private $encryption_key = 'EE8E1E71AA6E692DB5B7C6E2AEB7D';
    private $api_base_url = 'https://connect.squareupsandbox.com/v2'; // Base URL for Square API

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->access_token = $this->get_access_token();
    }

    /**
     * Makes a request to the Square API.
     * 
     * @param string $endpoint The API endpoint.
     * @param string $method   The request method.
     * @param mixed  $body     The request body.
     * @param string $op_token Optional token for the request.
     * 
     * @return array The response from the API.
     */
    public function square_api_request($endpoint, $method = 'GET', $body = null, $op_token = null)
    {
        $token = isset($op_token) ? $op_token : $this->access_token;
        $url = $this->api_base_url . $endpoint;
        $headers = [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if (null !== $body) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error) {
            error_log('Curl error: ' . $error);
            return ['success' => false, 'error' => $error];
        }

        if ($status_code >= 200 && $status_code < 300) {
            return ['success' => true, 'data' => json_decode($response, true)];
        } else {
            $error_message = "Square API request failed. Status Code: $status_code. Response: $response";
            error_log($error_message);
            return ['success' => false, 'error' => $error_message];
        }
    }

    /**
     * Validates the Access Token.
     *
     * @param string|null $op_token Optional token to validate.
     * @return bool True if the token is valid, false otherwise.
     */
    public function is_token_valid($op_token = null)
    {
        if (isset($op_token)) {
            $response = $this->square_api_request('/locations', 'GET', null, $op_token);
            return $response['success'] && $response['data'] !== null;
        }
        $response = $this->square_api_request('/locations');
        return $response['success'] && $response['data'] !== null;
    }

    /**
     * Encrypts the access token.
     *
     * @param string $token The access token to encrypt.
     * @return string|false The encrypted token, or false on failure.
     */
    public function encrypt_access_token($token)
    {
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $encrypted = openssl_encrypt($token, 'aes-256-cbc', $this->encryption_key, 0, $iv);
        if (false === $encrypted) {
            error_log('Encryption failed.');
            return false;
        }

        return base64_encode($encrypted . '::' . $iv);
    }

    /**
     * Decrypts the access token.
     *
     * @param string $encrypted_token The encrypted access token.
     * @return string|false The decrypted token, or false on failure.
     */
    public function decrypt_access_token($encrypted_token)
    {
        list($encrypted_data, $iv) = explode('::', base64_decode($encrypted_token), 2);
        $decrypted = openssl_decrypt($encrypted_data, 'aes-256-cbc', $this->encryption_key, 0, $iv);
        if (false === $decrypted) {
            error_log('Decryption failed.');
            return false;
        }

        return $decrypted;
    }

    /**
     * Retrieves the access token from settings.
     *
     * @return string|null The access token, or null if not found.
     */
    public function get_access_token()
    {
        $settings = get_option('sws_settings', []);
        $token = isset($settings['access_token']) ? $settings['access_token'] : null;
        if ($token) {
            return $this->decrypt_access_token($token);
        }
        error_log('Access token not found in settings.');
        return null;
    }


    /**
     * Retrieves details of a Square item.
     *
     * @param string $catalog_object_id The ID of the catalog object.
     * @return array Response array with success status and data or error message.
     */
    public function get_square_item_details($catalog_object_id)
    {
        $endpoint = "/catalog/object/" . $catalog_object_id;
        $response = $this->square_api_request($endpoint);

        if ($response['success']) {
            return $response['data'];
        } else {
            error_log('Failed to get Square item details: ' . $response['error']);
            return ['success' => false, 'error' => $response['error']];
        }
    }

    /**
     * Updates a Square product with WooCommerce data.
     *
     * @param array $woo_data    Data from WooCommerce product.
     * @param array $square_data Data from Square product.
     * @return array Response array with status of inventory and product update.
     */
    public function update_square_product($woo_data, $square_data)
    {
        $idempotency_key = uniqid('sq_', true);

        // Update product details
        $square_data['item_data']['name'] = $woo_data['name'];
        $square_data['item_data']['description'] = $woo_data['description'];

        // Update variations and inventory
        $this->update_variations($square_data, $woo_data);
        $inventory = $this->get_inventory($woo_data);
        $inventory_update_status = null;

        if (!empty($inventory['success']) && !empty($inventory['data'])) {
            $updated_inventory_data = $this->updated_inventory_data($inventory['data']['counts'], $woo_data);
            $inventory_update_status = $this->update_inventory($updated_inventory_data);
        }

        $body = [
            'idempotency_key' => $idempotency_key,
            'object' => $square_data
        ];
        $product_update_status = $this->square_api_request("/catalog/object", 'POST', $body);

        return [
            'inventoryUpdateStatus' => $inventory_update_status,
            'productUpdateStatus' => $product_update_status
        ];
    }

    /**
     * Updates variations of a variable product in Square.
     *
     * @param array &$square_variations Variations from Square.
     * @param array $woo_variations Variations from WooCommerce.
     */
    private function update_variable_product_variations(&$square_variations, $woo_variations)
    {
        if (empty($woo_variations)) {
            return;
        }

        $woo_variation_map = array_column($woo_variations, null, 'square_id');
        foreach ($square_variations as &$variation) {
            if (isset($woo_variation_map[$variation['id']])) {
                $this->update_simple_product_variation($variation, $woo_variation_map[$variation['id']]);
            }
        }
    }

    /**
     * Updates inventory in Square.
     *
     * @param array $inventory Inventory data to update.
     * @return array Response from the Square API.
     */
    private function update_inventory($inventory)
    {
        $idempotency_key = uniqid('sq_', true);
        $occurred_at = date('Y-m-d\TH:i:s.') . sprintf("%03d", (microtime(true) - floor(microtime(true))) * 1000) . 'Z';

        $changes = array_map(function ($inv) use ($occurred_at) {
            return [
                'physical_count' => [
                    'catalog_object_id' => $inv['catalog_object_id'],
                    'location_id' => $inv['location_id'],
                    'occurred_at' => $occurred_at,
                    'state' => 'IN_STOCK',
                    'quantity' => (string) $inv['quantity']
                ],
                'type' => 'PHYSICAL_COUNT'
            ];
        }, array_filter($inventory, function ($inv) {
            return $inv['state'] === 'IN_STOCK';
        }));

        return $this->square_api_request("/inventory/changes/batch-create", 'POST', [
            'idempotency_key' => $idempotency_key,
            'changes' => $changes
        ]);
    }

    /**
     * Updates the variations in the Square product data.
     *
     * @param array &$square_data Data from Square product.
     * @param array $woo_data     Data from WooCommerce product.
     */
    private function update_variations(&$square_data, $woo_data)
    {
        $this->update_variable_product_variations($square_data['item_data']['variations'], $woo_data['variations']);
    }

    /**
     * Updates a single variation of a product in Square.
     *
     * @param array &$square_variation Variation data from Square.
     * @param array $woo_variation     Variation data from WooCommerce.
     */
    private function update_simple_product_variation(&$square_variation, $woo_variation)
    {
        $square_variation['item_variation_data']['price_money']['amount'] = floatval($woo_variation['price']) * 100;
        $square_variation['item_variation_data']['sku'] = $woo_variation['sku'];
    }

    /**
     * Retrieves inventory data for WooCommerce product variations.
     *
     * @param array $woo_data Data from WooCommerce product.
     * @return array Response from the Square API.
     */
    private function get_inventory($woo_data)
    {
        $endpoint = "/inventory/counts/batch-retrieve";
        $method = 'POST';
        $body = [
            'catalog_object_ids' => []
        ];

        foreach ($woo_data['variations'] as $variation) {
            if (isset($variation['square_id'])) {
                $body['catalog_object_ids'][] = $variation['square_id'];
            }
        }

        return $this->square_api_request($endpoint, $method, $body);
    }

    /**
     * Updates the inventory data based on WooCommerce variations.
     *
     * @param array $inventory Current inventory data.
     * @param array $woo_data  Data from WooCommerce product.
     * @return array Modified inventory data.
     */
    private function updated_inventory_data($inventory, $woo_data)
    {
        if (!isset($woo_data['variations'])) {
            return $inventory;
        }

        foreach ($inventory as &$inv) {
            foreach ($woo_data['variations'] as $variation) {
                if (isset($variation['square_id']) && $variation['square_id'] === $inv['catalog_object_id']) {
                    $inv['quantity'] = $variation['stock'];
                    break;
                }
            }
        }
        unset($inv);

        return $inventory;
    }
}
