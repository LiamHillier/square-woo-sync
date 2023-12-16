<?php

namespace Pixeldev\SWS\Logger;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Asynchronous Logger Class
 *
 * Handles logging operations asynchronously by storing log entries in a queue
 * and processing them at the end of the script execution.
 */
class Logger
{
    /**
     * Queue to store log entries.
     *
     * @var SplQueue
     */
    private $log_queue;

    /**
     * Constructor for Async_Logger.
     *
     * Initializes the log queue and registers the shutdown action.
     */
    public function __construct()
    {
        $this->log_queue = new \SplQueue();
        add_action('shutdown', array($this, 'process_log_queue'));
    }

    /**
     * Enqueues a log entry.
     *
     * @param string $level   The severity level of the log.
     * @param string $message The log message.
     * @param array  $context Additional context for the log entry.
     */
    public function log($level, $message, $context = array())
    {
        $this->log_queue->enqueue(array(
            'level'     => $level,
            'message'   => $message,
            'context'   => $context,
            'timestamp' => current_time('mysql')
        ));
    }

    /**
     * Processes the log queue.
     *
     * Writes each log entry in the queue to the database at the end of script execution.
     */
    public function process_log_queue()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'sws_logs';

        while (!$this->log_queue->isEmpty()) {
            $log_entry = $this->log_queue->dequeue();
            $wpdb->insert(
                $table_name,
                array(
                    'timestamp' => $log_entry['timestamp'],
                    'log_level' => $log_entry['level'],
                    'message'   => $log_entry['message'],
                    'context'   => maybe_serialize($log_entry['context'])
                ),
                array('%s', '%s', '%s', '%s')
            );
        }
    }

    /**
     * Retrieves log entries from the sws_logs table.
     *
     * @param array $args {
     *     Optional. Arguments to retrieve log entries.
     *
     *     @type int    $limit  Number of log entries to retrieve. Default 20.
     *     @type int    $offset Offset for the query (for pagination). Default 0.
     *     @type string $level  Log level to filter by. Default empty (all levels).
     * }
     * @return array|\WP_Error Array of log entries or WP_Error on failure.
     */
    public function get_sws_logs($args = array())
    {
        global $wpdb;

        // Set defaults and extract variables
        $defaults = array(
            'limit'  => 20,
            'offset' => 0,
            'level'  => '',
        );
        $args = wp_parse_args($args, $defaults);
        extract($args);

        $table_name = $wpdb->prefix . 'sws_logs';
        $query = "SELECT * FROM $table_name";
        $query_conditions = array();

        // Filter by log level if provided
        if (!empty($level)) {
            $query_conditions[] = $wpdb->prepare("log_level = %s", $level);
        }

        // Add conditions to query if applicable
        if (!empty($query_conditions)) {
            $query .= " WHERE " . implode(' AND ', $query_conditions);
        }

        // Add limit and offset
        $query .= $wpdb->prepare(" LIMIT %d OFFSET %d", $limit, $offset);

        // Execute the query
        $results = $wpdb->get_results($query);

        if (null === $results) {
            return new \WP_Error('database_error', 'Error fetching logs from the database.');
        }

        return $results;
    }
}