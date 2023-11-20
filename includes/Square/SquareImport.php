<?php

namespace Pixeldev\SWS\Square;

use Pixeldev\SWS\Square\SquareHelper;
use Square\SquareClient;
use Square\Environment;
use WooCommerce\WC_Product_Simple;

class SquareImport extends SquareHelper
{

    private $client;
    public function __construct()
    {
        $token = $this->get_access_token();
        $this->client = new SquareClient([
            'accessToken' => $token,
            'environment' => Environment::SANDBOX, // or ::PRODUCTION
        ]);
    }

    public function get_access_token()
    {
        $settings = get_option('sws_settings', []);
        $token = isset($settings['access_token']) ? $settings['access_token'] : null;

        if ($token) {
            $squareHelper = new SquareHelper($token);
            $decryptedToken = $squareHelper->decrypt_access_token($token);
            return $decryptedToken;
        }

        return null;
    }


    public function import_products($square_products)
    {
        $results = [];

        foreach ($square_products as $square_product) {
            try {
                $wc_product_data = $this->map_square_product_to_woocommerce($square_product);
                $product_id = $this->create_or_update_woocommerce_product($wc_product_data);

                if ($product_id) {
                    $results[] = ['status' => 'success', 'product_id' => $product_id, 'message' => 'Product imported successfully'];
                } else {
                    $results[] = ['status' => 'failure', 'product_id' => null, 'message' => 'Failed to import product'];
                }
            } catch (\Exception $e) {
                error_log('Error importing product: ' . $e->getMessage());
                $results[] = ['status' => 'failure', 'product_id' => null, 'message' => 'Exception occurred: ' . $e->getMessage()];
            }
        }

        return $results;
    }



    private function map_square_product_to_woocommerce($square_product)
    {
        // error_log(json_encode($square_product));
        $wc_product_data = [];

        // Basic product details
        $wc_product_data['name'] = $square_product['item_data']['name'];
        $wc_product_data['description'] = $square_product['item_data']['description_plaintext'];
        $wc_product_data['type'] = count($square_product['item_data']['variations']) > 1 ? 'variable' : 'simple';
        $wc_product_data['sku'] = $square_product['item_data']['variations'][0]['item_variation_data']['sku'] . '-sws';

        // Pricing, SKU, and variations for variable products

        $wc_product_data['variations'] = [];
        foreach ($square_product['item_data']['variations'] as $variation) {
            $variation_data = [
                'name' => $variation['item_variation_data']['name'],
                'sku' => $variation['item_variation_data']['sku'],
                'price' => $variation['item_variation_data']['price_money']['amount'] / 100,
                'attributes' => []
            ];

            // Extracting attributes from the variation
            if (isset($variation['item_option_values'])) {
                foreach ($variation['item_option_values'] as $option) {
                    $variation_data['attributes'][] = [
                        'name' => $option['optionName'],
                        'option' => $option['optionValue']
                    ];
                }
            }

            $wc_product_data['variations'][] = $variation_data;
        }

        $wc_product_data['price'] = $square_product['item_data']['variations'][0]['item_variation_data']['price_money']['amount'] / 100;


        // Additional mappings can be added as needed (e.g., categories, images, etc.)

        return $wc_product_data;
    }


    private function create_or_update_woocommerce_product($wc_product_data)
    {
        try {

            // Check if a product with the given SKU already exists in WooCommerce
            $product_id = wc_get_product_id_by_sku($wc_product_data['sku']);

            // Determine the product type and create or load the appropriate product object
            if ($wc_product_data['type'] === 'simple') {
                $product = $product_id ? wc_get_product($product_id) : new \WC_Product_Simple();
            } else {
                $product = $product_id ? wc_get_product($product_id) : new \WC_Product_Variable();
            }

            // Set common product properties
            $product->set_name($wc_product_data['name']);
            $product->set_sku($wc_product_data['sku']);
            $product->set_description($wc_product_data['description']);

            if ($wc_product_data['type'] === 'variable') {
                $all_attribute_options = [];

                // Aggregate options for each attribute across all variations
                foreach ($wc_product_data['variations'] as $variation) {
                    foreach ($variation['attributes'] as $attribute) {
                        $all_attribute_options[$attribute['name']][] = $attribute['option'];
                    }
                }

                // Make sure options are unique and set them for product-level attributes
                $attributes = [];
                foreach ($all_attribute_options as $name => $options) {
                    $attribute_id = $this->get_or_create_global_attribute($name);

                    if ($attribute_id !== false) {
                        $attribute = new \WC_Product_Attribute();
                        $attribute->set_id($attribute_id);
                        $attribute->set_name('pa_' . wc_sanitize_taxonomy_name($name));

                        $term_ids = array();
                        foreach ($options as $option) {
                            $term_id = $this->get_or_create_attribute_term($name, $option);
                            if ($term_id !== false) {
                                $term_ids[] = $term_id;
                            }
                        }

                        $attribute->set_options($term_ids);
                        $attribute->set_visible(true);
                        $attribute->set_variation(true);
                        $attributes[] = $attribute;
                    }
                }
                $product->set_attributes($attributes);

                $product->save(); // Save to get ID for variations

                $existing_variations = $product->get_children();
                foreach ($wc_product_data['variations'] as $variation_data) {
                    $variation_id = wc_get_product_id_by_sku($variation_data['sku']);
                    $variation = $variation_id ? new \WC_Product_Variation($variation_id) : new \WC_Product_Variation();
                    $variation->set_parent_id($product->get_id());
                    $variation->set_sku($variation_data['sku']);
                    $variation->set_regular_price($variation_data['price']);

                    $variation_attributes = [];
                    foreach ($variation_data['attributes'] as $attribute) {

                        $attr_slug = 'attribute_pa_' . sanitize_title($attribute['name']);

                        $variation_attributes[$attr_slug] = sanitize_title($attribute['option']);
                    }

                    $variation->set_attributes($variation_attributes);

                    $variation->save();
                }
            } else {
                // For simple products
                $product->set_regular_price($wc_product_data['price']);

                // Handle attributes for simple products (if any)
                $attributes = [];
                if (isset($wc_product_data['attributes'])) {
                    foreach ($wc_product_data['attributes'] as $name => $value) {
                        $attribute_id = $this->get_or_create_global_attribute($name);
                        if ($attribute_id !== false) {
                            $attribute = new \WC_Product_Attribute();
                            $attribute->set_id($attribute_id);
                            $attribute->set_name('pa_' . wc_sanitize_taxonomy_name($name));

                            $term_id = $this->get_or_create_attribute_term($name, $value);
                            $attribute->set_options($term_id ? [$term_id] : []);
                            $attribute->set_visible(true);
                            $attributes[] = $attribute;
                        }
                    }
                    $product->set_attributes($attributes);
                }
            }

            $product->save();
            return $product->get_id(); // Return the product ID

        } catch (\Exception $e) {
            error_log('Error creating/updating product: ' . $e->getMessage());
            return false; // Return false in case of error
        }
    }


    private function get_or_create_global_attribute($attribute_name)
    {
        $taxonomy = 'pa_' . wc_sanitize_taxonomy_name($attribute_name);

        if (!taxonomy_exists($taxonomy)) {
            // Create the attribute if it doesn't exist
            $args = array(
                'name'         => $attribute_name,
                'slug'         => wc_sanitize_taxonomy_name($attribute_name),
                'type'         => 'select',
                'order_by'     => 'menu_order',
                'has_archives' => true,
            );
            $result = wc_create_attribute($args);

            if (is_wp_error($result)) {
                error_log('Error creating attribute: ' . $result->get_error_message());
                return false;
            }

            // Get the ID of the created attribute
            $attribute_id = $result;
        } else {
            $attribute_id = wc_attribute_taxonomy_id_by_name($taxonomy);
        }

        return $attribute_id;
    }

    private function get_or_create_attribute_term($attribute_name, $term_name)
    {
        $taxonomy = 'pa_' . wc_sanitize_taxonomy_name($attribute_name);

        // Ensure taxonomy exists
        if (!taxonomy_exists($taxonomy)) {
            error_log("Taxonomy does not exist: {$taxonomy}");
            return false;
        }

        $term = get_term_by('name', $term_name, $taxonomy);
        if (!$term) {
            // Create the term if it doesn't exist
            $result = wp_insert_term($term_name, $taxonomy);

            if (is_wp_error($result)) {
                error_log('Error creating term: ' . $result->get_error_message());
                return false;
            }

            // wp_insert_term returns an array with the term ID
            $term_id = $result['term_id'];
        } else {
            // If the term exists, get_term_by returns an object, so we use $term->term_id
            $term_id = $term->term_id;
        }

        return $term_id;
    }






    // Additional methods for handling product variations, attributes, etc.
}
