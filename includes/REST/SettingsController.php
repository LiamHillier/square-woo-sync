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
                    'args'                => $this->get_endpoint_args_for_item_schema(true),
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
            return rest_ensure_response(['access_token' => $maskedToken]);
        }

        return rest_ensure_response(['access_token' => 'Token not set or empty']);
    }

    // Set a new access token
    public function set_access_token(WP_REST_Request $request): WP_REST_Response
    {
        $token = $request->get_param('access_token');
        $squareHelper = new SquareHelper($token);

        if (!$squareHelper->isTokenValid()) {
            return new WP_Error('invalid_token', 'The provided token is invalid', ['status' => 400]);
        }

        $encryptedToken = $squareHelper->encrypt_access_token($token);
        $settings = get_option('sws_settings', []);
        $settings['access_token'] = $encryptedToken;
        update_option('sws_settings', $settings);

        return rest_ensure_response(['message' => 'Access token updated successfully']);
    }

    // Delete the access token
    public function delete_access_token(WP_REST_Request $request): WP_REST_Response
    {
        $settings = get_option('sws_settings', []);
        unset($settings['access_token']);
        update_option('sws_settings', $settings);

        return rest_ensure_response(['message' => 'Access token removed successfully']);
    }

    /**
     * Retrieves the plugin settings.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response Response object.
     */
    public function get_settings(WP_REST_Request $request): WP_REST_Response
    {
        $settings = get_option('sws_settings', []);

        $requested_setting = $request->get_param('setting');
        if (!empty($requested_setting) && isset($settings[$requested_setting])) {
            $value = $settings[$requested_setting];
            return rest_ensure_response([$requested_setting => $value]);
        }

        // Return an empty response if no specific setting is requested
        return rest_ensure_response(new \stdClass()); // Corrected reference to stdClass
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
        $current_settings = get_option('sws_settings', []);

        foreach ($params as $key => $value) {
            $current_settings[$key] = $value;
        }

        update_option('sws_settings', $current_settings);

        return rest_ensure_response($current_settings);
    }
}
