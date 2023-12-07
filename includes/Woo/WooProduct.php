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
        add_action('woocommerce_update_product', [$this, 'onProductUpdate']);
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
            $this->updateSquareProduct($squareProductId, $wooData);
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
            error_log(json_encode($updatedResponse));
        }
    }
}
