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

            // Initialize arrays
            $variationIds = [];
            $imageIds = [];

            // Use foreach loops instead of array_map to avoid memory-intensive operations
            foreach ($square_products as &$product) {
                $productCatalogObjectId = $product['id'] ?? null;
                $product['inventory_count'] = 'Not Available'; // Set default value

                if (isset($product['item_data']['variations'])) {
                    foreach ($product['item_data']['variations'] as &$variation) {
                        $variationId = $variation['id'] ?? null;
                        $variation['inventory_count'] = 'Not Available'; // Set default value
                        $variationIds[] = $variationId;
                    }
                    unset($variation); // Break reference with the last element
                }

                if (isset($product['item_data']['image_ids'])) {
                    foreach ($product['item_data']['image_ids'] as $id) {
                        $imageIds[] = $id;
                    }
                }
            }
            unset($product); // Break reference to the last element

            $inventoryCounts = $this->fetchInventoryCounts(array_unique($variationIds));
            $imageUrls = $this->fetchSquareImageUrls(array_unique($imageIds));

            foreach ($square_products as &$product) {
                $this->enhanceProduct($product, $inventoryCounts, $item_options, $item_option_values, $imageUrls);
            }
            unset($product); // Break reference to the last element

            return $square_products;
        } catch (\Exception $e) {
            error_log('Error in SquareInventory::retrieve_inventory: ' . $e->getMessage());
            return ['error' => 'Failed to retrieve inventory from Square.'];
        }
    }

    private function enhanceProduct(&$product, $inventoryCounts, $item_options, $item_option_values, $imageUrls)
    {
        $productId = $product['id'] ?? null;
        $product['inventory_count'] = $inventoryCounts[$productId] ?? 'Not Available';

        if (isset($product['item_data']['variations'])) {
            foreach ($product['item_data']['variations'] as &$variation) {
                $variationId = $variation['id'] ?? null;
                $variation['inventory_count'] = $inventoryCounts[$variationId] ?? 'Not Available';

                if (isset($variation['item_variation_data']['item_option_values'])) {
                    foreach ($variation['item_variation_data']['item_option_values'] as &$optionValue) {
                        $optionId = $optionValue['item_option_id'];
                        $optionValueId = $optionValue['item_option_value_id'];
                        $optionValue['optionName'] = ($item_options[$optionId] ?? null) ?: null;
                        $optionValue['optionValue'] = ($item_option_values[$optionId][$optionValueId] ?? null) ?: null;
                        unset($optionValue['item_option_id'], $optionValue['item_option_value_id']);
                    }
                    unset($optionValue);
                }
            }
            unset($variation);
        }

        if (isset($product['item_data']['image_ids'])) {
            $product['item_data']['image_urls'] = array_map(
                fn ($id) => $imageUrls[$id] ?? null,
                $product['item_data']['image_ids']
            );
        }
    }





    public function fetchSquareImageUrls(array $imageIds)
    {
        $chunkSize = 500; // Adjust this value if needed
        $allImageUrls = [];

        foreach (array_chunk($imageIds, $chunkSize) as $chunk) {
            $batchRequestData = ['object_ids' => $chunk];
            $response = $this->squareApiRequest('/catalog/batch-retrieve', 'POST', $batchRequestData);

            if ($response['success'] && isset($response['data']['objects'])) {
                foreach ($response['data']['objects'] as $object) {
                    if (isset($object['image_data']['url'])) {
                        $allImageUrls[$object['id']] = $object['image_data']['url'];
                    }
                }
            } else {
                error_log('Error fetching Square images for a chunk: ' . json_encode($response));
                // Optionally handle partial failures here
            }
            // Free up memory
            unset($response);
        }

        return $allImageUrls;
    }

    public function fetchImageURL($imageId)
    {
        $imageUrl = '';
        $response = $this->squareApiRequest('/catalog/object/' . $imageId);
        if ($response['success'] && isset($response['data']['object'])) {
            if (isset($response['data']['object']['image_data']['url'])) {
                $imageUrl = $response['data']['object']['image_data']['url'];
            }
        } else {
            error_log('Error fetching Square image: ' . json_encode($response));
            // Optionally handle partial failures here
        }
        // Free up memory
        unset($response);
        return $imageUrl;
    }

    private function fetchSquareItems()
    {
        $cursor = null;
        $items = [];
        do {
            $response = $this->squareApiRequest('/catalog/list?types=ITEM&cursor=' . $cursor);
            if ($response['success']) {
                foreach ($response['data']['objects'] as $item) {
                    $items[] = $this->filterItemData($item);
                }
                $cursor = $response['data']['cursor'] ?? null;
            } else {
                error_log('Error fetching Square items: ' . $response['error']);
            }
        } while ($cursor);

        return $items;
    }

    private function filterItemData($item)
    {
        $filteredItem = [
            'id' => $item['id'] ?? null,
            'item_data' => [
                'category_id' => $item['item_data']['category_id'] ?? null,
                'name' => $item['item_data']['name'] ?? null,
                'description' => $item['item_data']['description'] ?? $item['item_data']['description_plaintext'] ?? null,
                'image_ids' => $item['item_data']['image_ids'] ?? [],
                'variations' => []
            ]
        ];

        foreach ($item['item_data']['variations'] as $variation) {
            $filteredItem['item_data']['variations'][] = [
                'id' => $variation['id'] ?? null,
                'item_variation_data' => [
                    'item_id' => $variation['item_variation_data']['item_id'] ?? null,
                    'name' => $variation['item_variation_data']['name'] ?? null,
                    'sku' => $variation['item_variation_data']['sku'] ?? null,
                    'price_money' => $variation['item_variation_data']['price_money'] ?? null,
                    'item_option_values' => $variation['item_variation_data']['item_option_values'] ?? null
                ]
            ];
        }

        return $filteredItem;
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
        $chunkSize = 500; // Max items per request
        $inventoryCounts = [];

        foreach (array_chunk($catalogObjectIds, $chunkSize) as $chunk) {
            $postData = ['catalog_object_ids' => $chunk];
            $response = $this->squareApiRequest('/inventory/counts/batch-retrieve', 'POST', $postData);

            if ($response['success'] && isset($response['data']['counts'])) {
                foreach ($response['data']['counts'] as $count) {
                    $objectId = $count['catalog_object_id'];
                    $quantity = $count['quantity'] ?? '0';
                    $inventoryCounts[$objectId] = $quantity;
                }
            } else {
                // If there's an error, log it and continue with the next chunk
                error_log('Error fetching inventory counts: ' . json_encode($response));
                foreach ($chunk as $id) {
                    $inventoryCounts[$id] = 'Not Available';
                }
            }
            // Free up memory
            unset($response);
        }

        return $inventoryCounts;
    }




    /**
     * Retrieve Square categories.
     *
     * @return array
     */
    public function getAllSquareCategories()
    {
        try {
            $response = $this->squareApiRequest('/catalog/list?types=CATEGORY');
            if ($response['success']) {
                $categories = [];
                foreach ($response['data']['objects'] as $object) {
                    if ($object['type'] === 'CATEGORY') {
                        $categories[$object['id']] = $object['category_data']['name'];
                    }
                }

                return $categories;
            } else {
                error_log('Error fetching Square categories: ' . $response['error']);
                return ['error' => 'Error fetching Square categories: ' . $response['error']];
            }
        } catch (\Exception $e) {
            error_log('Error in SquareInventory::getAllSquareCategories: ' . $e->getMessage());
            return ['error' => 'Failed to retrieve categories from Square.'];
        }
    }

    private function chunkArray(array $array, $chunkSize)
    {
        $chunks = [];
        foreach (array_chunk($array, $chunkSize) as $chunk) {
            $chunks[] = $chunk;
        }
        return $chunks;
    }
}
