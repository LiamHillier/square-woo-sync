<?php

namespace Pixeldev\SWS\Woo;

if (!defined('ABSPATH')) {
  exit; // Exit if accessed directly.
}

/**
 * Class to handle WooCommerce product creation.
 */
class CreateProduct
{

  /**
   * Entry point for creating or updating a WooCommerce product.
   *
   * @param array $wc_product_data Data for the WooCommerce product.
   * @param array $data_to_import Data indicating what should be imported.
   * @param bool $update_only Flag indicating whether to only update existing products.
   * @return int|false Product ID on success, or false on failure.
   */
  public function create_or_update_product($wc_product_data, $data_to_import, $update_only)
  {
    try {
      $product = $this->get_or_create_product_by_square_id($wc_product_data, $update_only);

      if ($update_only && !$product) {
        return false;
      }

      $this->update_common_product_properties($product, $wc_product_data, $data_to_import);

      if ('variable' === $wc_product_data['type']) {
        $this->handle_variable_product($product, $wc_product_data, $data_to_import);
      } else {
        $this->handle_simple_product($product, $wc_product_data, $data_to_import);
      }

      if ($data_to_import['categories'] && !empty($wc_product_data['category'])) {
        $this->assign_product_category($product, $wc_product_data);
      }

      if ($data_to_import['image'] && !empty($wc_product_data['images'])) {
        $this->import_product_images($product, $wc_product_data, $data_to_import);
      }

      return $product->get_id();
    } catch (\Exception $e) {
      error_log('Error creating/updating product: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Retrieves or creates a product based on Square product ID.
   *
   * @param array $wc_product_data Data for the WooCommerce product.
   * @param bool $update_only Indicates whether to update existing products only.
   * @return \WC_Product|false WooCommerce product object or false if not found and update_only is true.
   */
  private function get_or_create_product_by_square_id($wc_product_data, $update_only)
  {
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

    return $product_id ? wc_get_product($product_id) : ($wc_product_data['type'] === 'simple' ? new \WC_Product_Simple() : new \WC_Product_Variable());
  }

  /**
   * Updates common properties of a WooCommerce product.
   *
   * @param \WC_Product $product WooCommerce product object.
   * @param array $wc_product_data Data for the WooCommerce product.
   * @param array $data_to_import Data indicating what should be imported.
   */
  private function update_common_product_properties($product, $wc_product_data, $data_to_import)
  {
    // Set common product properties
    $product->set_name($wc_product_data['name']);
    if ($wc_product_data['type'] === 'simple') {
      $product->set_sku($wc_product_data['sku']);
    }

    $product->update_meta_data('square_product_id', $wc_product_data['square_product_id']);

    if ($data_to_import['description'] && isset($wc_product_data['description'])) {
      $product->set_description($wc_product_data['description']);
    }
  }

  /**
   * Handles variable products.
   *
   * @param \WC_Product_Variable $product WooCommerce variable product object.
   * @param array $wc_product_data Data for the WooCommerce product.
   * @param array $data_to_import Data indicating what should be imported.
   */
  private function handle_variable_product($product, $wc_product_data, $data_to_import)
  {
    global $wpdb;
    $product_id = $product->get_id();

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
    $product->save();
  }

  /**
   * Handles simple products.
   *
   * @param \WC_Product_Simple $product WooCommerce simple product object.
   * @param array $wc_product_data Data for the WooCommerce product.
   * @param array $data_to_import Data indicating what should be imported.
   */
  private function handle_simple_product($product, $wc_product_data, $data_to_import)
  {
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
    $product->save();
  }

  /**
   * Assigns a product category.
   *
   * @param \WC_Product $product WooCommerce product object.
   * @param array $wc_product_data Data for the WooCommerce product.
   */
  private function assign_product_category($product, $wc_product_data)
  {
    $category_name = $wc_product_data['category'];
    $category_id = $this->get_or_create_category($category_name);
    $product_id = $product->get_id();
    if ($category_id) {
      // Assign category to the product
      wp_set_object_terms($product_id, $category_id, 'product_cat');
      $product->save(); // Save the product with the category
    }
  }

  /**
   * Imports product images.
   *
   * @param \WC_Product $product WooCommerce product object.
   * @param array $wc_product_data Data for the WooCommerce product.
   * @param array $data_to_import Data indicating what should be imported.
   */
  private function import_product_images($product, $wc_product_data, $data_to_import)
  {
    $product->set_image_id('');
    $product_id = $product->get_id();
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
}
