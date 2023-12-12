<?php

namespace Pixeldev\SWS\Woo;

use Pixeldev\SWS\Square\SquareHelper;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Class to handle WooCommerce product interactions.
 */
class SyncProduct
{

    /**
     * Constructor.
     */
    public function __construct()
    {
        add_action('init', array($this, 'init_woo_product'));
    }

    /**
     * Initialize WooCommerce Product hooks.
     */
    public function init_woo_product()
    {
        if (class_exists('WooCommerce')) {
            add_action('add_meta_boxes', array($this, 'add_sync_meta_box'));
            add_action('admin_post_sync_to_square', array($this, 'handle_sync_to_square'));
            add_action('admin_footer', array($this, 'add_ajax_script'));
            add_action('wp_ajax_sync_to_square', array($this, 'handle_ajax_sync_to_square'));
        }
    }

    /**
     * Adds a meta box for syncing with Square.
     */
    public function add_sync_meta_box()
    {
        add_meta_box(
            'sws_sync_square',
            'Sync with Square',
            array($this, 'sync_meta_box_html'),
            'product',
            'side',
            'high'
        );
    }

    /**
     * Adds JavaScript for AJAX synchronization.
     */
    public function add_ajax_script()
    {
        $screen = get_current_screen();
        if ('product' !== $screen->id) {
            return;
        }

        $js_file_url = get_site_url(null, '/wp-content/plugins/square-woo-sync/assets/js/sync-metabox.js');
        wp_enqueue_script('sws-custom-script', $js_file_url, array('jquery'), '1.0', true);
        wp_localize_script('sws-custom-script', 'swsAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('sws_ajax_nonce'),
        ));
    }

    /**
     * AJAX handler for syncing products to Square.
     */
    public function handle_ajax_sync_to_square()
    {
        check_ajax_referer('sws_ajax_nonce', 'nonce');

        $product_id = intval($_POST['product_id']);
        if ($product_id) {
            $result = $this->on_product_update($product_id);
            error_log(json_encode($result));
            if ($result && $this->is_sync_successful($result)) {
                wp_send_json_success(array('message' => 'Product synced successfully with Square.'));
            } else {
                wp_send_json_error(array('message' => $result['error']));
            }
        } else {
            wp_send_json_error(array('message' => 'Invalid product ID.'));
        }
    }

    /**
     * Check if sync result is successful.
     * 
     * @param array $result The result array.
     * 
     * @return bool
     */
    private function is_sync_successful($result)
    {
        return (isset($result['inventoryUpdateStatus']['success']) && $result['inventoryUpdateStatus']['success'] === true) ||
            (isset($result['productUpdateStatus']['success']) && $result['productUpdateStatus']['success'] === true);
    }


    /**
     * Renders the HTML for the meta box.
     * 
     * @param WP_Post $post The post object.
     */
    public function sync_meta_box_html($post)
    {
        $square_product_id = get_post_meta($post->ID, 'square_product_id', true);

        if (!empty($square_product_id)) {
            echo '<p>Sync this product to Square</p>';
            echo '<button id="sync_to_square_button" class="update-button button button-primary button-large" data-product-id="' . esc_attr($post->ID) . '">Sync to Square</button>';
            echo '<p class="sws-notice">Update the product and then run the above sync. For a full tutorial, please read the documentation.</p>';
        } else {
            echo '<p>No Square product ID found. Unable to sync to square. Only products imported from square can be synced.</p>';
        }
    }

    /**
     * Handles the product update process.
     * 
     * @param int $product_id The product ID.
     * @return mixed
     */
    public function on_product_update($product_id)
    {
        $settings = get_option('sws_settings', []);
        if (empty($settings['wooAuto'])) {
            return null;
        }

        $product = wc_get_product($product_id);
        if (!$product instanceof \WC_Product) {
            return null; // Optionally log this error.
        }

        $square_product_id = get_post_meta($product_id, 'square_product_id', true);
        $woo_data = $this->get_woo_product_data($product, $square_product_id);

        if ($square_product_id && !empty($woo_data)) {
            return $this->update_square_product($square_product_id, $woo_data);
        }
    }

    /**
     * Retrieves WooCommerce product data.
     * 
     * @param \WC_Product $product          WooCommerce product object.
     * @param string      $square_product_id Square product ID.
     * @return array
     */
    private function get_woo_product_data(\WC_Product $product, $square_product_id)
    {
        $woo_data = [
            'name'        => $product->get_name(),
            'description' => $product->get_description(),
            'variations'  => []
        ];

        if ($product->is_type('variable')) {
            foreach ($product->get_children() as $variation_id) {
                $variation = wc_get_product($variation_id);
                if (!$variation) {
                    continue;
                }

                $variation_product_id = get_post_meta($variation->get_id(), 'square_product_id', true);
                $woo_data['variations'][] = $this->format_variation_data($variation, $variation_product_id);
            }
        } else {
            $woo_data['variations'][] = $this->format_variation_data($product, $square_product_id);
        }

        return $woo_data;
    }

    /**
     * Formats variation data for synchronization.
     * 
     * @param \WC_Product $product          WooCommerce product object.
     * @param string      $square_product_id Square product ID.
     * @return array
     */
    private function format_variation_data(\WC_Product $product, $square_product_id)
    {
        return [
            'price'     => $product->get_price(),
            'sku'       => $product->get_sku(),
            'stock'     => $product->get_stock_quantity(),
            'square_id' => $square_product_id,
        ];
    }

    /**
     * Updates the Square product with WooCommerce data.
     * 
     * @param string $square_product_id Square product ID.
     * @param array  $woo_data          WooCommerce product data.
     * @return mixed
     */
    private function update_square_product($square_product_id, $woo_data)
    {
        $square_helper = new SquareHelper();
        $square_product_data = $square_helper->get_square_item_details($square_product_id);

        if (isset($square_product_data['object'])) {
            if (count($woo_data['variations']) === 1) {
                $woo_data['variations'][0]['square_id'] = $square_product_data['object']['item_data']['variations'][0]['id'];
            }

            $updated_response = $square_helper->update_square_product($woo_data, $square_product_data['object']);
            return $updated_response;
        } else {
            return $square_product_data;
        }
    }
}