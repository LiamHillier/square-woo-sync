<?php

namespace Pixeldev\SWS\Square;

use Pixeldev\SWS\Square\SquareHelper;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Class responsible for importing products from Square to WooCommerce.
 */
class SquareImport extends SquareHelper
{

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Imports products from Square to WooCommerce.
     *
     * @param array $square_products Products to import.
     * @param array $data_to_import Data to be imported.
     * @param bool $update_only Flag to update existing products only.
     * @return array Results of the import process.
     */
    public function import_products($square_products, $data_to_import, $update_only = false)
    {
        $results = [];

        foreach ($square_products as $square_product) {
            try {
                $wc_product_data = $this->map_square_product_to_woocommerce($square_product);
                $product_id = $this->create_or_update_woocommerce_product($wc_product_data, $data_to_import, $update_only);

                if (false !== $product_id) {
                    $results[] = ['status' => 'success', 'product_id' => $product_id, 'square_id' => $square_product['id'], 'message' => 'Product imported successfully'];
                } else {
                    $results[] = ['status' => 'failed', 'product_id' => null, 'square_id' => $square_product['id'], 'message' => 'Failed to import product'];
                }
            } catch (\Exception $e) {
                error_log('Error importing product: ' . $e->getMessage());
                $results[] = ['status' => 'failure', 'product_id' => null, 'message' => 'Exception occurred: ' . $e->getMessage()];
            }
        }

        return $results;
    }

    /**
     * Maps a Square product to a WooCommerce product format.
     *
     * @param array $square_product The Square product to map.
     * @return array The WooCommerce product data.
     */
    private function map_square_product_to_woocommerce($square_product)
    {
        error_log(json_encode($square_product));

        $wc_product_data = [];

        // Map basic product details from Square to WooCommerce
        $wc_product_data['name'] = $square_product['item_data']['name'];
        $wc_product_data['description'] = $square_product['item_data']['description'] ?? '';
        $wc_product_data['type'] = count($square_product['item_data']['variations']) > 1 ? 'variable' : 'simple';
        $wc_product_data['sku'] = $square_product['item_data']['variations'][0]['item_variation_data']['sku'];

        $wc_product_data['square_product_id'] = $square_product['id'];

        $category_name = isset($square_product['item_data']['category_name']) ? sanitize_text_field($square_product['item_data']['category_name']) : '';
        $wc_product_data['category'] = $category_name;


        // Map pricing, SKU, and variations for variable products
        $wc_product_data['variations'] = [];
        foreach ($square_product['item_data']['variations'] as $variation) {
            $variation_data = [
                'name' => $variation['item_variation_data']['name'],
                'sku' => $variation['item_variation_data']['sku'],
                'price' => $variation['item_variation_data']['price_money']['amount'] / 100,
                'attributes' => [],
                'stock' => intval($variation['inventory_count'] ?? 0),
                'variation_square_id' => $variation['id']
            ];

            if (isset($variation['item_variation_data']['item_option_values'])) {
                foreach ($variation['item_variation_data']['item_option_values'] as $option) {
                    $variation_data['attributes'][] = [
                        'name' => $option['optionName'],
                        'option' => $option['optionValue']
                    ];
                }
            }

            $wc_product_data['variations'][] = $variation_data;
        }


        $wc_product_data['stock'] = intval($square_product['item_data']['variations'][0]['inventory_count'] ?? '0');
        $wc_product_data['price'] = $square_product['item_data']['variations'][0]['item_variation_data']['price_money']['amount'] / 100;


        if (!empty($square_product['item_data']['image_urls']) && !empty($square_product['item_data']['image_ids'])) {
            // Handle Multiple Image Imports
            $image_urls = $square_product['item_data']['image_urls'];
            $square_image_ids = $square_product['item_data']['image_ids'];

            // Instead of importing images here, just store the image URLs and Square image IDs
            $wc_product_data['images'] = array_combine($square_image_ids, $image_urls);
        }

        return $wc_product_data;
    }

    /**
     * Imports an image from a URL into the WordPress media library.
     *
     * @param string $image_url The URL of the image to import.
     * @return int|false The attachment ID on success, false on failure.
     */
    private function import_image_from_url($image_url, $square_image_id, $product_id)
    {
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');



        // Check if the image already exists in the media library
        $existing_image_id = $this->find_existing_image_id($square_image_id);
        if ($existing_image_id) {
            return $existing_image_id;
        }

        // Download image and create a new attachment
        $image_id = media_sideload_image($image_url, $product_id, 0, 'id');
        if (!is_wp_error($image_id)) {
            // Assume $square_image_id is the image ID from Square
            add_post_meta($image_id, 'square_image_id', $square_image_id, true);
        }


        if (is_wp_error($image_id)) {
            error_log('Failed to import image: ' . $image_url);
            return false;
        }

        return $image_id;
    }

    /**
     * Finds the ID of an existing image in the media library by its filename.
     *
     * @param string $image_url The URL of the image to find.
     * @return int|null The ID of the existing image, or null if not found.
     */
    private function find_existing_image_id($square_image_id)
    {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'square_image_id' AND meta_value = %s",
            $square_image_id
        );

        $result = $wpdb->get_var($query);

        if ($wpdb->last_error) {
            error_log('Database query error: ' . $wpdb->last_error);
        }

        return $result ? intval($result) : null;
    }

    /**
     * Creates or updates a WooCommerce product.
     *
     * @param array $wc_product_data The WooCommerce product data.
     * @param array $data_to_import Data specifying what to import.
     * @param bool $update_only Whether to only update existing products.
     * @return int|false The product ID on success, or false on failure.
     */
    private function create_or_update_woocommerce_product($wc_product_data, $data_to_import, $update_only)
    {

        try {
            global $wpdb;
            $meta_key = 'square_product_id';
            $meta_value = $wc_product_data['square_product_id'];

            $query = $wpdb->prepare(
                "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %s LIMIT 1",
                $meta_key,
                $meta_value
            );

            $product_id = $wpdb->get_var($query);

            // Check if the product exists. If $update_only is true and no product is found, return false
            if ($update_only && !$product_id) {
                return false;
            }

            $product = $product_id ? wc_get_product($product_id) : ($wc_product_data['type'] === 'simple' ? new \WC_Product_Simple() : new \WC_Product_Variable());

            // Set common product properties
            $product->set_name($wc_product_data['name']);
            if ($wc_product_data['type'] === 'simple') {
                $product->set_sku($wc_product_data['sku']);
            }

            $product->update_meta_data('square_product_id', $wc_product_data['square_product_id']);

            if ($data_to_import['description'] && isset($wc_product_data['description'])) {
                $product->set_description($wc_product_data['description']);
            }


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

                // Direct SQL to get variation IDs and SKUs
                $sql = "SELECT post_id, meta_value as sku FROM {$wpdb->postmeta} 
                        WHERE post_id IN (
                            SELECT ID FROM {$wpdb->posts} 
                            WHERE post_parent = %d AND post_type = 'product_variation'
                        ) AND meta_key = '_sku'";

                $current_variations = $wpdb->get_results($wpdb->prepare($sql, $product_id), ARRAY_A);

                // Extract SKUs and their corresponding post IDs
                $current_skus = array_column($current_variations, 'sku', 'post_id');

                // Unset the original variations array as it's no longer needed
                unset($current_variations);

                $imported_skus = array_column($wc_product_data['variations'], 'sku');

                foreach ($current_skus as $variation_id => $sku) {
                    if (!in_array($sku, $imported_skus)) {
                        wp_delete_post($variation_id, true);
                    }
                }

                // Unset variables that are no longer needed
                unset($current_skus, $imported_skus);

                foreach ($wc_product_data['variations'] as $variation_data) {
                    $variation_id = wc_get_product_id_by_sku($variation_data['sku']);
                    $variation = $variation_id ? new \WC_Product_Variation($variation_id) : new \WC_Product_Variation();
                    $variation->set_parent_id($product->get_id());
                    $variation->set_sku($variation_data['sku']);

                    if ($data_to_import['stock'] && isset($variation_data['stock'])) {

                        $variation->set_manage_stock(true);
                        $variation->set_stock_quantity($variation_data['stock']);
                    }

                    if ($data_to_import['price'] && isset($variation_data['price'])) {
                        $variation->set_regular_price($variation_data['price']);
                    }

                    $variation_attributes = [];
                    foreach ($variation_data['attributes'] as $attribute) {

                        $attr_slug = 'attribute_pa_' . sanitize_title($attribute['name']);

                        $variation_attributes[$attr_slug] = sanitize_title($attribute['option']);
                    }

                    $variation->set_attributes($variation_attributes);

                    $variation->update_meta_data('square_product_id', $variation_data['variation_square_id']);

                    $variation->save();
                }
            } else {
                // For simple products
                if ($data_to_import['price'] && isset($wc_product_data['price'])) {
                    $product->set_regular_price($wc_product_data['price']);
                }

                if ($data_to_import['stock'] && isset($wc_product_data['stock'])) {
                    $product->set_manage_stock(true);
                    $product->set_stock_quantity($wc_product_data['stock']);
                }

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
            // After the product is created/updated and has an ID
            $product_id = $product->get_id();


            // Handle category assignment
            if ($data_to_import['categories'] && !empty($wc_product_data['category'])) {
                $category_name = $wc_product_data['category'];
                $category_id = $this->get_or_create_category($category_name);

                if ($category_id) {
                    // Assign category to the product
                    wp_set_object_terms($product_id, $category_id, 'product_cat');
                    $product->save(); // Save the product with the category
                }
            }
            // Check if there are images to import
            if ($data_to_import['image'] && !empty($wc_product_data['images'])) {
                $product->set_image_id('');
                $product->set_gallery_image_ids(array()); // Remove existing gallery images
                $imported_image_ids = [];

                // Loop through each image URL and import it
                foreach ($wc_product_data['images'] as $square_image_id => $image_url) {
                    $imported_image_id = $this->import_image_from_url($image_url, $square_image_id, $product_id);
                    if ($imported_image_id) {
                        $imported_image_ids[] = $imported_image_id;
                    }
                }

                // Set the first image as the featured image and remaining as gallery images
                if (!empty($imported_image_ids)) {
                    $featured_image_id = array_shift($imported_image_ids); // Remove and get the first image id
                    $product->set_image_id($featured_image_id); // Set featured image

                    if (!empty($imported_image_ids)) {
                        $product->set_gallery_image_ids($imported_image_ids); // Set the remaining images as gallery images
                    }

                    $product->save(); // Save the product with the new images
                }
            }

            return $product_id;
        } catch (\Exception $e) {
            error_log('Error creating/updating product: ' . $e->getMessage());
            return false; // Return false in case of error
        }
    }


    /**
     * Creates or retrieves a WooCommerce category.
     *
     * @param string $category_name The name of the category.
     * @return int|false The category ID on success, or false on failure.
     */
    private function get_or_create_category($category_name)
    {
        // Check if the category already exists
        $term = term_exists($category_name, 'product_cat');

        if ($term !== 0 && $term !== null) {
            // Category exists, return its ID
            return (int) $term['term_id'];
        } else {
            // Category does not exist, create it
            $new_term = wp_insert_term($category_name, 'product_cat');

            if (!is_wp_error($new_term)) {
                return $new_term['term_id'];
            } else {
                // Handle the error appropriately
                error_log('Error creating category: ' . $new_term->get_error_message());
                return false;
            }
        }
    }


    private function ensure_taxonomy_exists($attribute_name)
    {
        $taxonomy = 'pa_' . wc_sanitize_taxonomy_name($attribute_name);
        if (!taxonomy_exists($taxonomy)) {
            // Register the taxonomy
            register_taxonomy($taxonomy, 'product', array(
                'label' => $attribute_name,
                'public' => true,
                'show_ui' => true,
                'show_in_quick_edit' => false,
                'show_admin_column' => true,
                'hierarchical' => false,
                'show_in_menu' => true,
            ));

            // Clear the cache to ensure the new taxonomy is immediately available
            delete_option('woocommerce_attribute_taxonomies');
            wp_cache_flush();
        }
    }

    /**
     * Retrieves or creates a global WooCommerce attribute.
     *
     * @param string $attribute_name The name of the attribute.
     * @return int|bool The attribute ID if successful, or false on failure.
     */
    private function get_or_create_global_attribute($attribute_name)
    {
        $taxonomy = 'pa_' . wc_sanitize_taxonomy_name($attribute_name);

        if (!taxonomy_exists($taxonomy)) {
            // Create the attribute if it doesn't exist
            $args = array(
                'name' => $attribute_name,
                'slug' => wc_sanitize_taxonomy_name($attribute_name),
                'type' => 'select',
                'order_by' => 'menu_order',
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

    /**
     * Retrieves or creates a WooCommerce attribute term.
     *
     * @param string $attribute_name The name of the attribute.
     * @param string $term_name The name of the term.
     * @return int|bool The term ID if successful, or false on failure.
     */
    private function get_or_create_attribute_term($attribute_name, $term_name)
    {
        $this->ensure_taxonomy_exists($attribute_name);
        $taxonomy = 'pa_' . wc_sanitize_taxonomy_name($attribute_name);

        $term = get_term_by('name', $term_name, $taxonomy);
        if (!$term) {
            $result = wp_insert_term($term_name, $taxonomy);
            if (is_wp_error($result)) {
                error_log('Error creating term: ' . $result->get_error_message());
                return false;
            }
            $term_id = $result['term_id'];
        } else {
            $term_id = $term->term_id;
        }

        return $term_id;
    }
}
