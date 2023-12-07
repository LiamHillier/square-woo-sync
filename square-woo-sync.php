<?php

/**
 * Plugin Name:     Square Woo Sync
 * Plugin URI:      https://pixeldev.com.au
 * Description:     Nothing
 * Author:          pixeldev
 * Author URI:      https://pxieldev.com.au
 * Text Domain:     square-woo-sync
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         SquareWooSync
 */

defined('ABSPATH') || exit;

/**
 * SWS class.
 *
 * @class SWS The class that holds the entire SWS plugin
 */
final class SWS
{
    /**
     * Plugin version.
     *
     * @var string
     */
    const VERSION = '0.0.1';

    /**
     * Plugin slug.
     *
     * @var string
     *
     * @since 0.2.0
     */
    const SLUG = 'square-woo-sync';

    /**
     * Holds various class instances.
     *
     * @var array
     *
     * @since 0.2.0
     */
    private $container = [];

    /**
     * Constructor for the JobPlace class.
     *
     * Sets up all the appropriate hooks and actions within our plugin.
     *
     * @since 0.2.0
     */
    private function __construct()
    {
        require_once __DIR__ . '/vendor/autoload.php';

        $this->define_constants();

        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        add_action('wp_loaded', [$this, 'flush_rewrite_rules']);
        $this->init_plugin();
    }

    /**
     * Initializes the Wp_React_Kit() class.
     *
     * Checks for an existing Wp_React_Kit() instance
     * and if it doesn't find one, creates it.
     *
     * @since 0.2.0
     *
     * @return SWS|bool
     */
    public static function init()
    {
        static $instance = false;

        if (!$instance) {
            $instance = new SWS();
        }

        return $instance;
    }

    /**
     * Magic getter to bypass referencing plugin.
     *
     * @since 0.2.0
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __get($prop)
    {
        if (array_key_exists($prop, $this->container)) {
            return $this->container[$prop];
        }

        return $this->{$prop};
    }

    /**
     * Magic isset to bypass referencing plugin.
     *
     * @since 0.2.0
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __isset($prop)
    {
        return isset($this->{$prop}) || isset($this->container[$prop]);
    }

    /**
     * Define the constants.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function define_constants()
    {
        define('SWS_VERSION', self::VERSION);
        define('SWS_SLUG', self::SLUG);
        define('SWS_FILE', __FILE__);
        define('SWS_DIR', __DIR__);
        define('SWS_PATH', dirname(SWS_FILE));
        define('SWS_INCLUDES', SWS_PATH . '/includes');
        define('SWS_TEMPLATE_PATH', SWS_PATH . '/templates');
        define('SWS_URL', plugins_url('', SWS_FILE));
        define('SWS_BUILD', SWS_URL . '/build');
        define('SWS_ASSETS', SWS_URL . '/assets');
    }

    /**
     * Load the plugin after all plugins are loaded.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_plugin()
    {
        $this->includes();
        $this->init_hooks();

        /**
         * Fires after the plugin is loaded.
         *
         * @since 0.2.0
         */
        do_action('SWS_loaded');
    }

    /**
     * Activating the plugin.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function activate()
    {
        // TODO: need to get settings first
        update_option('sws_settings', array(
            "squareAuto" => array(
                "isActive" => false,
                "stock" => true,
                "title" => true,
                "description" => true,
                "images" => true,
                "category" => true,
                "price" => true,
            ),
            "wooAuto" =>  array(
                "isActive" => false,
                "stock" => false,
                "title" => false,
                "description" => false,
                "images" => false,
                "category" => false,
                "price" => false,
            ),
        ));



        // global $wpdb;

        // $table_name = $wpdb->prefix . 'sws_import_progress';
        // $charset_collate = $wpdb->get_charset_collate();

        // $sql = "CREATE TABLE $table_name (
        //     id INT AUTO_INCREMENT PRIMARY KEY,
        //     product_id INT,
        //     square_id VARCHAR(255),
        //     status VARCHAR(255),
        //     message TEXT,
        //     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        // ) $charset_collate;";

        // require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        // dbDelta($sql);
    }

    /**
     * Placeholder for deactivation function.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function deactivate()
    {
        //
    }

    /**
     * Flush rewrite rules after plugin is activated.
     *
     * Nothing being added here yet.
     *
     * @since 0.2.0
     */
    public function flush_rewrite_rules()
    {
        // fix rewrite rules
    }

    /**
     * Run the installer to create necessary migrations and seeders.
     *
     * @since 0.3.0
     *
     * @return void
     */
    private function install()
    {
        //  $installer = new \Pixeldev\SWS\Setup\Installer();
        //  $installer->run();
    }

    /**
     * Include the required files.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function includes()
    {
        if ($this->is_request('admin')) {
            $this->container['admin_menu'] = new Pixeldev\SWS\Admin\Menu();
        }
        // Common classes
        $this->container['assets']   = new  Pixeldev\SWS\Assets\Manager();
        $this->container['rest_api'] = new  Pixeldev\SWS\REST\Api();
    }

    /**
     * Initialize the hooks.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_hooks()
    {
        // Init classes
        add_action('init', [$this, 'init_classes']);


        // Add the plugin page links
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), [$this, 'plugin_action_links']);
    }

    /**
     * Instantiate the required classes.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_classes()
    {
        // Init necessary hooks
        // $squareWooSync = new Pixeldev\SWS\Square\SquareImport();
        // $squareWooSync->import_products();
        //  new Pixeldev\SWS\User\Hooks();
    }

    /**
     * What type of request is this.
     *
     * @since 0.2.0
     *
     * @param string $type admin, ajax, cron or frontend
     *
     * @return bool
     */
    private function is_request($type)
    {
        switch ($type) {
            case 'admin':
                return is_admin();

            case 'ajax':
                return defined('DOING_AJAX');

            case 'rest':
                return defined('REST_REQUEST');

            case 'cron':
                return defined('DOING_CRON');

            case 'frontend':
                return (!is_admin() || defined('DOING_AJAX')) && !defined('DOING_CRON');
        }
    }

    /**
     * Plugin action links
     *
     * @param array $links
     *
     * @since 0.2.0
     *
     * @return array
     */
    public function plugin_action_links($links)
    {
        $links[] = '<a href="' . admin_url('admin.php?page=square-woo-sync#/settings') . '">' . __('Settings', 'square-woo-sync') . '</a>';
        $links[] = '<a href="https://github.com/ManiruzzamanAkash/wp-react-kit#quick-start" target="_blank">' . __('Documentation', 'square-woo-sync') . '</a>';

        return $links;
    }
}

/**
 * Initialize the main plugin.
 *
 * @since 0.2.0
 *
 * @return \SWS|bool
 */
function sws()
{
    return SWS::init();
}

/*
  * Kick-off the plugin.
  *
  * @since 0.2.0
  */

/**
 * Activation notice callback function
 */
function your_plugin_activation_notice()
{


    // Check for the required PHP extensions
    $required_extensions = array('curl', 'dom');

    $missing_extensions = array();

    foreach ($required_extensions as $extension) {
        if (!extension_loaded($extension)) {
            $missing_extensions[] = $extension;
        }
    }

    if (!empty($missing_extensions)) {
        // deactivate_plugins(plugin_basename(__FILE__));
        // Display a notice about missing extensions using the admin_notices hook
        $notice = '<div class="notice notice-error is-dismissible">';
        $notice .= '<p>Square Woo Sync requires the following PHP extensions, which are not enabled:</p><p><strong>' . implode(',', $missing_extensions) . '</strong></p><p>Please contact your server provider and ask them to enable these php extentions.</p>';
        $notice .= '</div>';
        echo $notice;
    }
}
add_action('admin_notices', 'your_plugin_activation_notice');

sws();

new Pixeldev\SWS\Woo\WooProduct();
