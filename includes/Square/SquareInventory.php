<?php

namespace Pixeldev\SWS\Square;

class SquareInventory extends SquareHelper
{

    public function __construct()
    {
        parent::__construct($this->get_access_token());
    }

    public function retrieve_inventory()
    {
        try {
            $square_products = $this->fetchSquareItems();
            $item_options = $this->fetchSquareItemOptions();
            $item_option_values = $this->fetchSquareItemOptionValues();

            // Prepare the final array of products with options
            $enhanced_products = [];

            // Collect variation IDs
            $variationIds = [];
            foreach ($square_products as $product) {
                $product = json_decode(json_encode($product), true);
                if (isset($product['item_data']['variations'])) {
                    foreach ($product['item_data']['variations'] as $variation) {
                        $variationIds[] = $variation['id']; // Collecting variation IDs
                    }
                }
            }
            // Now use these variation IDs for inventory batch retrieve
            $inventoryCounts = $this->fetchInventoryCounts($variationIds);


            foreach ($square_products as $product) {
                $product_data = json_decode(json_encode($product), true);

                // Assign inventory count to the product
                $productCatalogObjectId = $product_data['id'] ?? null;
                $product_data['inventory_count'] = $inventoryCounts[$productCatalogObjectId] ?? 'Not Available';

                if (isset($product_data['item_data']['variations']) && !empty($product_data['item_data']['variations'])) {
                    foreach ($product_data['item_data']['variations'] as $index => &$variation) {
                        $variationOptions = [];

                        $variationId = $variation['id'] ?? null;
                        $variation['inventory_count'] = $inventoryCounts[$variationId] ?? 'Not Available';

                        if (isset($variation['item_variation_data']['item_option_values'])) {
                            foreach ($variation['item_variation_data']['item_option_values'] as $optionValue) {


                                $optionId = $optionValue['item_option_id'];
                                $optionValueId = $optionValue['item_option_value_id'];
                                $optionName = $item_options[$optionId] ?? null;
                                $optionValueName = $item_option_values[$optionId][$optionValueId] ?? null;

                                $variationOptions[] = [
                                    'optionName' => $optionName,
                                    'optionValue' => $optionValueName
                                ];
                            }
                        }

                        // Update the variation with the new options
                        $variation['item_option_values'] = $variationOptions;
                    }
                    unset($variation); // Break the reference with the last element
                }

                $catalogObjectId = $product_data['id'] ?? null;
                if ($catalogObjectId && isset($inventoryCounts[$catalogObjectId])) {
                    $product_data['inventory_count'] = $inventoryCounts[$catalogObjectId];
                } else {
                    $product_data['inventory_count'] = 'Not Available';
                }

                // Fetch and assign image URL to the product
                if (isset($product_data['item_data']['image_ids'])) {
                    $product_data['item_data']['image_urls'] = [];
                    foreach ($product_data['item_data']['image_ids'] as $id) {
                        $product_data['item_data']['image_urls'][] = $this->fetchSquareImageUrl($id);
                    }
                }

                // Add the enhanced product data to the final array
                $enhanced_products[] = $product_data;
            }

            return $enhanced_products;
        } catch (\Exception $e) {
            // Log the exception and return an error message
            error_log('Error in SquareInventory::retrieve_inventory: ' . $e->getMessage());
            return ['error' => 'Failed to retrieve inventory from Square.'];
        }
    }


    private function fetchSquareImageUrl($imageId)
    {
        $response = $this->squareApiRequest("/catalog/object/" . $imageId);


        if ($response['success']) {
            // Access the nested URL
            return $response['data']['object']['image_data']['url'] ?? null;
        } else {
            error_log('Error fetching Square image: ' . $response['error']);
            return null;
        }
    }


    private function fetchSquareItems()
    {
        $cursor = null;
        $items = [];

        do {
            $response = $this->squareApiRequest('/catalog/list?types=ITEM&cursor=' . $cursor);
            if ($response['success']) {
                $items = array_merge($items, $response['data']['objects']);
                $cursor = $response['data']['cursor'] ?? null;
            } else {
                error_log('Error fetching Square items: ' . $response['error']);
                return ['error' => 'Error fetching Square itemss: ' . $response['error']];
            }
        } while ($cursor);

        return $items;
    }


    private function fetchSquareItemOptions()
    {
        $cursor = null;
        $options = [];

        do {
            $response = $this->squareApiRequest('/catalog/list?types=ITEM_OPTION&cursor=' . $cursor);
            if ($response['success']) {
                foreach ($response['data']['objects'] as $option) {
                    $options[$option['id']] = $option['item_option_data']['name'];
                }
                $cursor = $response['data']['cursor'] ?? null;
            } else {
                error_log('Error fetching Square item options: ' . $response['error']);
                return ['error' => 'Error fetching Square item options: ' . $response['error']];
            }
        } while ($cursor);

        return $options;
    }


    private function fetchSquareItemOptionValues()
    {
        $cursor = null;
        $optionValues = [];

        do {
            $response = $this->squareApiRequest('/catalog/list?types=ITEM_OPTION_VAL&cursor=' . $cursor);
            if ($response['success']) {
                foreach ($response['data']['objects'] as $valueObject) {
                    $optionId = $valueObject['item_option_value_data']['item_option_id'];
                    $valueId = $valueObject['id'];
                    $valueName = $valueObject['item_option_value_data']['name'];
                    $optionValues[$optionId][$valueId] = $valueName;
                }
                $cursor = $response['data']['cursor'] ?? null;
            } else {
                error_log('Error fetching Square item option values: ' . $response['error']);
                return ['error' => 'Error fetching Square item option values: ' . $response['error']];
            }
        } while ($cursor);
        return $optionValues;
    }

    private function fetchInventoryCounts($catalogObjectIds)
    {

        $postData = [
            'catalog_object_ids' => $catalogObjectIds
        ];

        $response = $this->squareApiRequest('/inventory/counts/batch-retrieve', 'POST', $postData);


        if ($response['success'] && isset($response['data']['counts'])) {
            foreach ($response['data']['counts'] as $count) {
                $objectId = $count['catalog_object_id'];
                $quantity = $count['quantity'] ?? '0';
                $inventoryCounts[$objectId] = $quantity;
            }
        } else {
            // Handle error or set default value
            foreach ($catalogObjectIds as $id) {
                $inventoryCounts[$id] = 'Not Available';
            }
        }

        return $inventoryCounts;
    }




    public function getAllSquareCategories()
    {
        try {
            $response = $this->squareApiRequest('/catalog/list?types=CATEGORY');
            if ($response['success']) {
                $categories = [];
                foreach ($response['data']['objects'] as $object) {
                    $categories[$object['id']] = $object['category_data']['name'];
                }

                return $categories;
            } else {
                error_log('Error fetching Square categories: ' . $response['error']);
                return ['error' => 'E rror fetching Square categories: ' . $response['error']];
            }
        } catch (\Exception $e) {
            error_log('Error in SquareInventory::getAllSquareCategories: ' . $e->getMessage());
            return ['error' => 'Failed to retrieve categories from Square.'];
        }
    }
}
