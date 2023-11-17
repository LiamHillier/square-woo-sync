<?php

namespace Pixeldev\SWS\Square;

use Square\SquareClient;
use Square\Environment;
use Square\Exceptions\ApiException;

class SquareHelper
{
    private $client;
    private $encryptionKey = 'your-secret-key'; // Define your encryption key

    public function __construct($accessToken)
    {
        $this->client = new SquareClient([
            'accessToken' => $accessToken,
            'environment' => Environment::SANDBOX, // or ::PRODUCTION
        ]);
    }

    public function isTokenValid()
    {
        try {
            $apiResponse = $this->client->getLocationsApi()->listLocations();
            return $apiResponse->isSuccess();
        } catch (ApiException $e) {
            error_log("Received error while calling Square: " . $e->getMessage());
            return false;
        }
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
        return openssl_decrypt($encrypted_data, 'aes-256-cbc', $this->encryptionKey, 0, $iv);
    }


    public function get_access_token()
    {
        $settings = get_option('sws_settings', []);
        $token = isset($settings['access_token']) ? $settings['access_token'] : null;

        if ($token) {
            $decryptedToken = $this->decrypt_access_token($token);
            return $decryptedToken;
        }

        return null;
    }

    // Other Square-related methods can be added here
}
