<?php

namespace Pixeldev\SWS\Admin;

/**
 * Admin Menu class.
 *
 * Responsible for managing admin menus.
 */
class Menu {

    /**
     * Constructor.
     *
     * @since 0.2.0
     */
    public function __construct() {
        add_action( 'admin_menu', [ $this, 'init_menu' ] );
    }

    /**
     * Init Menu.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_menu() {
        global $submenu;

        $slug          = SWS_SLUG;
        $menu_position = 50;
        $capability    = 'manage_options';
        $logo_icon     = SWS_ASSETS . '/images/logo (3) (1).png';

        add_menu_page( esc_attr__( 'Square Woo Sync', 'square-woo-sync' ), esc_attr__( 'Square Woo Sync', 'square-woo-sync' ), $capability, $slug, [ $this, 'plugin_page' ], $logo_icon, $menu_position );

        if ( current_user_can( $capability ) ) {
            $submenu[ $slug ][] = [ esc_attr__( 'Dashboard', 'square-woo-sync' ), $capability, 'admin.php?page=' . $slug . '#/' ];
            $submenu[ $slug ][] = [ esc_attr__( 'Inventory', 'square-woo-sync' ), $capability, 'admin.php?page=' . $slug . '#/inventory' ]; 
            $submenu[ $slug ][] = [ esc_attr__( 'Settings', 'square-woo-sync' ), $capability, 'admin.php?page=' . $slug . '#/settings' ]; 
        }

    }

    /**
     * Render the plugin page.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function plugin_page() {
        require_once SWS_TEMPLATE_PATH . '/app.php';
    }
}