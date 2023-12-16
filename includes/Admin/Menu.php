<?php

namespace Pixeldev\SWS\Admin;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

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
        $logo_icon     = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNhN2FhYWQiIGQ9Im0xNy41NzggNC40MzJsLTItMS4wNUMxMy44MjIgMi40NjEgMTIuOTQ0IDIgMTIgMnMtMS44MjIuNDYtMy41NzggMS4zODJsLS4zMjEuMTY5bDguOTIzIDUuMDk5bDQuMDE2LTIuMDFjLS42NDYtLjczMi0xLjY4OC0xLjI3OS0zLjQ2Mi0yLjIxWm00LjE3IDMuNTMybC0zLjk5OCAyVjEzYS43NS43NSAwIDAgMS0xLjUgMHYtMi4yODZsLTMuNSAxLjc1djkuNDRjLjcxOC0uMTc5IDEuNTM1LS42MDcgMi44MjgtMS4yODZsMi0xLjA1YzIuMTUxLTEuMTI5IDMuMjI3LTEuNjkzIDMuODI1LTIuNzA4Yy41OTctMS4wMTQuNTk3LTIuMjc3LjU5Ny00Ljh2LS4xMTdjMC0xLjg5MyAwLTMuMDc2LS4yNTItMy45NzhaTTExLjI1IDIxLjkwNHYtOS40NGwtOC45OTgtNC41QzIgOC44NjYgMiAxMC4wNSAyIDExLjk0MXYuMTE3YzAgMi41MjUgMCAzLjc4OC41OTcgNC44MDJjLjU5OCAxLjAxNSAxLjY3NCAxLjU4IDMuODI1IDIuNzA5bDIgMS4wNDljMS4yOTMuNjc5IDIuMTEgMS4xMDcgMi44MjggMS4yODZaTTIuOTYgNi42NDFsOS4wNCA0LjUybDMuNDExLTEuNzA1bC04Ljg4Ni01LjA3OGwtLjEwMy4wNTRjLTEuNzczLjkzLTIuODE2IDEuNDc3LTMuNDYyIDIuMjFaIi8+PC9zdmc+';

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
