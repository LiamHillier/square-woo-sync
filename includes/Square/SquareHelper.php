<?php

namespace Pixeldev\SWS\Square;

class SquareHelper
{
    private $accessToken;
    private $encryptionKey = 'EE8E1E71AA6E692DB5B7C6E2AEB7D';
    private $apiBaseUrl = 'https://connect.squareupsandbox.com/v2'; // Base URL for Square API

    public function __construct()
    {
        $this->accessToken = $this->get_access_token();
    }

    public function squareApiRequest($endpoint, $method = 'GET', $body = null, $opToken = null)
    {
        $token = isset($opToken) ? $opToken : $this->accessToken;
        $url = $this->apiBaseUrl . $endpoint;
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

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error) {
            error_log('Curl error: ' . $error);
            return ['success' => false, 'error' => $error];
        }

        if ($statusCode >= 200 && $statusCode < 300) {
            return ['success' => true, 'data' => json_decode($response, true)];
        } else {
            $errorMessage = "Square API request failed. Status Code: $statusCode. Response: $response";
            error_log($errorMessage);
            return ['success' => false, 'error' => $errorMessage];
        }
    }

    /**
     * Validates Access Token
     */
    public function isTokenValid($opToken = null)
    {
        if (isset($opToken)) {
            $response = $this->squareApiRequest('/locations', 'GET', null,  $opToken);
            return $response['success'] && $response['data'] !== null;
        }
        $response = $this->squareApiRequest('/locations');
        return $response['success'] && $response['data'] !== null;
    }
    /**
     * Encrypts the access token.
     *
     * @param string $token The access token to encrypt.
     * @return string The encrypted token.
     */
    public function encrypt_access_token($token)
    {
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $encrypted = openssl_encrypt($token, 'aes-256-cbc', $this->encryptionKey, 0, $iv);
        if (false === $encrypted) {
            error_log('Encryption failed.');
            return false;
        }

        return base64_encode($encrypted . '::' . $iv);
    }
    /**
     * Decrypts the access token.
     *
     * @param string $token The access token to decrypt.
     * @return string The decrypted token.
     */
    public function decrypt_access_token($encryptedToken)
    {
        list($encrypted_data, $iv) = explode('::', base64_decode($encryptedToken), 2);
        $decrypted = openssl_decrypt($encrypted_data, 'aes-256-cbc', $this->encryptionKey, 0, $iv);
        if (false === $decrypted) {
            error_log('Decryption failed.');
            return false;
        }

        return $decrypted;
    }


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

    public function getSquareItemDetails($catalogObjectId)
    {
        // Define the endpoint to get item details
        // Replace with the appropriate endpoint as per Square API documentation
        $endpoint = "/catalog/object/" . $catalogObjectId;

        // Make the API request using the squareApiRequest method
        $response = $this->squareApiRequest($endpoint);

        // Check if the request was successful and return the item details
        if ($response['success']) {
            return $response['data'];
        } else {
            // Handle the error case
            error_log('Failed to get Square item details: ' . $response['error']);
            return ['success' => false, 'error' => $response['error']];
        }
    }


    public function updateSquareProduct($wooData, $squareData)
    {
        $idempotencyKey = uniqid('sq_', true);

        $squareData['item_data']['name'] = $wooData['name'];
        $squareData['item_data']['description'] = $wooData['description'];

        $this->updateVariations($squareData, $wooData);

        $inventory = $this->getInventory($wooData);
        $inventoryUpdateStatus = null;
        if (!empty($inventory['success']) && !empty($inventory['data'])) {
            $updatedInventoryData = $this->updatedInventoryData($inventory['data']['counts'], $wooData);
            $inventoryUpdateStatus = $this->updateInventory($updatedInventoryData);
        }

        $body = [
            'idempotency_key' => $idempotencyKey,
            'object' => $squareData
        ];
        $productUpdateStatus = $this->squareApiRequest("/catalog/object", 'POST', $body);

        return [
            'inventoryUpdateStatus' => $inventoryUpdateStatus,
            'productUpdateStatus' => $productUpdateStatus
        ];
    }

    private function updateVariableProductVariations(&$squareVariations, $wooVariations)
    {
        if (empty($wooVariations)) {
            return;
        }

        $wooVariationMap = array_column($wooVariations, null, 'square_id');
        foreach ($squareVariations as &$variation) {
            if (isset($wooVariationMap[$variation['id']])) {
                $this->updateSimpleProductVariation($variation, $wooVariationMap[$variation['id']]);
            }
        }
    }

    private function updateInventory($inventory)
    {
        $idempotencyKey = uniqid('sq_', true);
        $occurredAt = date('Y-m-d\TH:i:s.') . sprintf("%03d", (microtime(true) - floor(microtime(true))) * 1000) . 'Z';

        $changes = array_map(function ($inv) use ($occurredAt) {
            return [
                'physical_count' => [
                    'catalog_object_id' => $inv['catalog_object_id'],
                    'location_id' => $inv['location_id'],
                    'occurred_at' => $occurredAt,
                    'state' => 'IN_STOCK',
                    'quantity' => (string)$inv['quantity']
                ],
                'type' => 'PHYSICAL_COUNT'
            ];
        }, array_filter($inventory, function ($inv) {
            return $inv['state'] === 'IN_STOCK';
        }));

        return $this->squareApiRequest("/inventory/changes/batch-create", 'POST', [
            'idempotency_key' => $idempotencyKey,
            'changes' => $changes
        ]);
    }

    private function updateVariations(&$squareData, $wooData)
    {
        $this->updateVariableProductVariations($squareData['item_data']['variations'], $wooData['variations']);
    }

    private function updateSimpleProductVariation(&$squareVariation, $wooVariation)
    {
        $squareVariation['item_variation_data']['price_money']['amount'] = floatval($wooVariation['price']) * 100;
        $squareVariation['item_variation_data']['sku'] = $wooVariation['sku'];
    }



    private function getInventory($wooData)
    {
        $endpoint = "/inventory/counts/batch-retrieve"; // Endpoint for Upsert Catalog Object
        $method = 'POST'; // The API requires a POST request
        $body = [
            'catalog_object_ids' => []
        ];

        foreach ($wooData['variations'] as $variation) {
            if (isset($variation['square_id'])) {
                $body['catalog_object_ids'][] = $variation['square_id'];
            }
        }
        // Make the API request and handle the response
        return $this->squareApiRequest($endpoint, $method, $body);
    }

    private function updatedInventoryData($inventory, $wooData)
    {
        if (!isset($wooData['variations'])) {
            // Handle the case where variations are not set
            return $inventory;
        }

        foreach ($inventory as &$inv) { // Notice the use of & to modify the array items directly
            foreach ($wooData['variations'] as $variation) {
                if (isset($variation['square_id']) && $variation['square_id'] === $inv['catalog_object_id']) {
                    $inv['quantity'] = $variation['stock'];
                    break; // This breaks out of the inner loop only
                }
            }
        }
        unset($inv); // Unset the reference to avoid unexpected behavior later

        return $inventory;
    }
}
