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

    // Other Square-related methods can be added here
}
