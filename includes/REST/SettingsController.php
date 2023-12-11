<?php

namespace Pixeldev\SWS\REST;

use Pixeldev\SWS\Abstracts\RESTController;
use Pixeldev\SWS\Square\SquareHelper;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * API SettingsController class for plugin settings.
 *
 * @since 0.5.0
 */
class SettingsController extends RESTController
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
    protected $base = 'settings';

    /**
     * Register routes for settings.
     *
     * @return void
     */
    public function register_routes()
    {
        register_rest_route($this->namespace, '/' . $this->base . '/access-token', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_access_token'],
                'permission_callback' => [$this, 'check_permission']
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'set_access_token'],
                'permission_callback' => [$this, 'check_permission']
            ],
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'delete_access_token'],
                'permission_callback' => [$this, 'check_permission']
            ]
        ]);
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [$this, 'get_settings'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [$this, 'update_settings'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_access_token(WP_REST_Request $request): WP_REST_Response
    {
        $settings = get_option('sws_settings', []);
        $token = isset($settings['access_token']) ? $settings['access_token'] : null;

        if ($token) {
            $squareHelper = new SquareHelper($token);
            $decryptedToken = $squareHelper->decrypt_access_token($token);
            $maskedToken = substr($decryptedToken, 0, 3) . '...' . substr($decryptedToken, -3);
            return rest_ensure_response(['access_token' => $maskedToken, 'status' => 200]);
        }

        return rest_ensure_response(['access_token' => 'Token not set or empty', 'status' => 400]);
    }

    // Set a new access token
    public function set_access_token(WP_REST_Request $request): WP_REST_Response
    {
        $token = $request->get_param('access_token');
        $squareHelper = new SquareHelper();

        if (!$squareHelper->is_token_valid($token)) {
            $error_data = ['message' => 'The provided token is invalid', 'status' => 400];
            return rest_ensure_response($error_data, 400);
        }

        $encryptedToken = $squareHelper->encrypt_access_token($token);
        $settings = get_option('sws_settings', []);
        $settings['access_token'] = $encryptedToken;
        update_option('sws_settings', $settings);

        return rest_ensure_response(['message' => 'Access token updated successfully', 'status' => 200]);
    }

    // Delete the access token
    public function delete_access_token(): WP_REST_Response
    {
        $settings = get_option('sws_settings', []);
        unset($settings['access_token']);
        update_option('sws_settings', $settings);

        return rest_ensure_response(['message' => 'Access token removed successfully']);
    }


    public function get_settings(WP_REST_Request $request): WP_REST_Response
    {
        $settings = get_option('sws_settings', []);

        if ($settings === false) {
            // Error occurred while retrieving settings.
            $error_message = 'Error retrieving plugin settings.';
            $response = new WP_REST_Response(['error' => $error_message], 500);
        } else {
            $requested_setting = $request->get_param('setting');
            if (!empty($requested_setting) && isset($settings[$requested_setting])) {
                $value = $settings[$requested_setting];
                // Check if the requested setting is "access_token"
                if ($requested_setting === 'access_token') {
                    // Exclude "access_token" from the response
                    $response = new WP_REST_Response([], 200);
                } else {
                    $response = new WP_REST_Response([$requested_setting => $value], 200);
                }
            } else {
                // Exclude "access_token" from the response if no specific setting is requested
                unset($settings['access_token']);
                $response = new WP_REST_Response($settings, 200);
            }
        }

        // Set the content type header to JSON.
        $response->set_headers(['Content-Type' => 'application/json']);

        return $response;
    }






    /**
     * Updates the plugin settings.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function update_settings(WP_REST_Request $request)
    {
        $params = $request->get_json_params();

        if (empty($params)) {
            $error_response = new WP_Error('empty_request', 'No settings provided in the request.', ['status' => 400]);
            return rest_ensure_response($error_response);
        }

        $current_settings = get_option('sws_settings', []);

        if ($current_settings === false) {
            $error_response = new WP_Error('get_option_error', 'Failed to retrieve current settings.', ['status' => 500]);
            return rest_ensure_response($error_response);
        }

        $updated = [];
        foreach ($params as $key => $value) {
            $current_settings[$key] = $value;
            $updated[$key] = $value;
        }

        update_option('sws_settings', $current_settings);


        if ($updated === false) {
            $error_response = new WP_Error('update_option_error', 'Failed to update settings.', ['status' => 500]);
            return rest_ensure_response($error_response);
        }

        return rest_ensure_response($updated);
    }
}
