<?php

namespace Pixeldev\SWS\REST;

use Pixeldev\SWS\Abstracts\RESTController;
use Pixeldev\SWS\Logger\Logger;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * API SettingsController class for plugin settings.
 *
 * @since 0.5.0
 */
class LogController extends RESTController
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
    protected $base = 'logs';

    /**
     * Register routes for settings.
     *
     * @return void
     */
    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [$this, 'get_logs'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    /**
     * Retrieves logs from dv
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_logs(): WP_REST_Response
    {

        $logger = new Logger();
        $logs = $logger->get_sws_logs(array('limit' => 50, 'offset' => 0));

        if (isset($logs)) {
            return rest_ensure_response(['logs' => $logs, 'status' => 200]);
        }

        return rest_ensure_response(['logs' => 'Unable to revtrieve logs', 'status' => 501]);
    }
}
