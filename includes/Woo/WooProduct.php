<?php

namespace Pixeldev\SWS\Woo;

use Pixeldev\SWS\Square\SquareHelper;


if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class WooProduct
{
    public function __construct()
    {
        add_action('init', array($this, 'initWooProduct'));
    }

    public function initWooProduct()
    {
        if (class_exists('WooCommerce')) {
            // WooCommerce is loaded, now you can safely use its functions
            add_action('add_meta_boxes', array($this, 'addSyncMetaBox'));
            add_action('admin_post_sync_to_square', array($this, 'handleSyncToSquare'));
            add_action('admin_footer', array($this, 'addAjaxScript'));
            add_action('wp_ajax_sync_to_square', array($this, 'handleAjaxSyncToSquare'));
        }
    }

    public function addSyncMetaBox()
    {
        add_meta_box(
            'sws_sync_square',           // Unique ID
            'Sync with Square',          // Box title
            array($this, 'syncMetaBoxHtml'), // Content callback
            'product',                   // Post type
            'side',                      // Context
            'high'                       // Priority
        );
    }

    public function addAjaxScript()
    {
        $screen = get_current_screen();
        if ($screen->id !== 'product') {
            return;
        }

        // Get the site's base URL and append the path to your JavaScript file
        $js_file_url = get_site_url(null, '/wp-content/plugins/square-woo-sync/assets/js/sync-metabox.js');

        wp_enqueue_script('sws-custom-script', $js_file_url, array('jquery'), '1.0', true);

        wp_localize_script('sws-custom-script', 'swsAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('sws_ajax_nonce'),
        ));
    }



    public function handleAjaxSyncToSquare()
    {
        check_ajax_referer('sws_ajax_nonce', 'nonce');

        $product_id = intval($_POST['product_id']);
        if ($product_id) {
            $result = $this->onProductUpdate($product_id);
            error_log(json_encode($result));
            if ($result && isset($result['inventoryUpdateStatus']['success']) && $result['inventoryUpdateStatus']['success'] === true || isset($result['productUpdateStatus']['success']) && $result['productUpdateStatus']['success'] === true) {
                wp_send_json_success(array('message' => 'Product synced successfully with Square.'));
            } else {
                wp_send_json_error(array('message' => $result['error']));
            }
        } else {
            wp_send_json_error(array('message' => 'Invalid product ID.'));
        }
    }

    public function syncMetaBoxHtml($post)
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


    public function onProductUpdate($productId)
    {
        $settings = get_option('sws_settings', []);
        if (empty($settings['wooAuto'])) {
            return;
        }

        $product = wc_get_product($productId);
        if (!$product instanceof \WC_Product) {
            return; // Optionally log this error
        }

        $squareProductId = get_post_meta($productId, 'square_product_id', true);
        $wooData = $this->getWooProductData($product, $squareProductId);

        if ($squareProductId && !empty($wooData)) {
            return $this->updateSquareProduct($squareProductId, $wooData);
        }
    }

    private function getWooProductData(\WC_Product $product, $squareProductId)
    {
        $wooData = [
            'name'        => $product->get_name(),
            'description' => $product->get_description(),
            'variations'  => []
        ];

        if ($product->is_type('variable')) {
            /** @var \WC_Product_Variable $product */
            foreach ($product->get_children() as $variationId) {
                $variation = wc_get_product($variationId);
                if (!$variation) continue;

                $variationProductId = get_post_meta($variation->get_id(), 'square_product_id', true);
                $wooData['variations'][] = $this->formatVariationData($variation, $variationProductId);
            }
        } else {
            $wooData['variations'][] = $this->formatVariationData($product, $squareProductId);
        }

        return $wooData;
    }

    private function formatVariationData(\WC_Product $product, $squareProductId)
    {
        return [
            'price'     => $product->get_price(),
            'sku'       => $product->get_sku(),
            'stock'     => $product->get_stock_quantity(),
            'square_id' => $squareProductId,
        ];
    }

    private function updateSquareProduct($squareProductId, $wooData)
    {
        $squareHelper = new SquareHelper();
        $squareProductData = $squareHelper->getSquareItemDetails($squareProductId);
        if (isset($squareProductData['object'])) {

            if (count($wooData['variations']) === 1) {
                $wooData['variations'][0]['square_id'] = $squareProductData['object']['item_data']['variations'][0]['id'];
            }

            $updatedResponse = $squareHelper->updateSquareProduct($wooData, $squareProductData['object']);
            return $updatedResponse;
        } else {
            return $squareProductData;
        }
    }
}
