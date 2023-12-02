<?php

namespace Pixeldev\SWS\Admin;

/**
 * Admin Menu class.
 *
 * Responsible for managing admin menus.
 */
class Menu
{

    /**
     * Constructor.
     *
     * @since 0.2.0
     */
    public function __construct()
    {
        add_action('admin_menu', [$this, 'init_menu']);
    }

    /**
     * Init Menu.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_menu()
    {
        global $submenu;

        $slug          = SWS_SLUG;
        $menu_position = 50;
        $capability    = 'manage_options';
        $logo_icon     = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0ibTE3LjU3OCA0LjQzMmwtMi0xLjA1QzEzLjgyMiAyLjQ2MSAxMi45NDQgMiAxMiAycy0xLjgyMi40Ni0zLjU3OCAxLjM4MmwtLjMyMS4xNjlsOC45MjMgNS4wOTlsNC4wMTYtMi4wMWMtLjY0Ni0uNzMyLTEuNjg4LTEuMjc5LTMuNDYyLTIuMjFabTQuMTcgMy41MzJsLTMuOTk4IDJWMTNhLjc1Ljc1IDAgMCAxLTEuNSAwdi0yLjI4NmwtMy41IDEuNzV2OS40NGMuNzE4LS4xNzkgMS41MzUtLjYwNyAyLjgyOC0xLjI4NmwyLTEuMDVjMi4xNTEtMS4xMjkgMy4yMjctMS42OTMgMy44MjUtMi43MDhjLjU5Ny0xLjAxNC41OTctMi4yNzcuNTk3LTQuOHYtLjExN2MwLTEuODkzIDAtMy4wNzYtLjI1Mi0zLjk3OFpNMTEuMjUgMjEuOTA0di05LjQ0bC04Ljk5OC00LjVDMiA4Ljg2NiAyIDEwLjA1IDIgMTEuOTQxdi4xMTdjMCAyLjUyNSAwIDMuNzg4LjU5NyA0LjgwMmMuNTk4IDEuMDE1IDEuNjc0IDEuNTggMy44MjUgMi43MDlsMiAxLjA0OWMxLjI5My42NzkgMi4xMSAxLjEwNyAyLjgyOCAxLjI4NlpNMi45NiA2LjY0MWw5LjA0IDQuNTJsMy40MTEtMS43MDVsLTguODg2LTUuMDc4bC0uMTAzLjA1NGMtMS43NzMuOTMtMi44MTYgMS40NzctMy40NjIgMi4yMVoiLz48L3N2Zz4=';

        add_menu_page(esc_attr__('Square Woo Sync', 'square-woo-sync'), esc_attr__('SquareWoo', 'square-woo-sync'), $capability, $slug, [$this, 'plugin_page'], $logo_icon, $menu_position);

        if (current_user_can($capability)) {
            $submenu[$slug][] = [esc_attr__('Dashboard', 'square-woo-sync'), $capability, 'admin.php?page=' . $slug . '#/'];
            $submenu[$slug][] = [esc_attr__('Inventory', 'square-woo-sync'), $capability, 'admin.php?page=' . $slug . '#/inventory'];
            $submenu[$slug][] = [esc_attr__('Settings', 'square-woo-sync'), $capability, 'admin.php?page=' . $slug . '#/settings/general'];
        }
    }

    /**
     * Render the plugin page.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function plugin_page()
    {
        require_once SWS_TEMPLATE_PATH . '/app.php';
    }
}
