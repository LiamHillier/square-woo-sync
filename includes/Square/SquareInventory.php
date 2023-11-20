<?php

namespace Pixeldev\SWS\Square;

use Square\SquareClient;
use Square\Environment;


class SquareInventory extends SquareHelper
{
    private $square;

    public function __construct()
    {
        $accessToken = $this->get_access_token();
        $this->square = new SquareClient([
            'accessToken' => $accessToken,
            'environment' => Environment::SANDBOX, // or ::PRODUCTION
        ]);
    }

    public function retrieve_inventory()
    {
        try {
            // Create an instance of the Catalog API
            $catalogApi = $this->square->getCatalogApi();

            $square_products = $this->fetchSquareItems($catalogApi);
            $item_options = $this->fetchSquareItemOptions($catalogApi);
            $item_option_values = $this->fetchSquareItemOptionValues($catalogApi);

            // Prepare the final array of products with options
            $enhanced_products = [];

            foreach ($square_products as $product) {
                $product_data = json_decode(json_encode($product), true);

                if (isset($product_data['item_data']['variations']) && !empty($product_data['item_data']['variations'])) {
                    foreach ($product_data['item_data']['variations'] as $index => &$variation) {
                        $variationOptions = [];

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

                        // Update the variation with the new options
                        $variation['item_option_values'] = $variationOptions;
                    }
                    unset($variation); // Break the reference with the last element
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

    private function fetchSquareItems($catalogApi)
    {
        $cursor = null;
        $items = [];

        do {
            $apiResponse = $catalogApi->listCatalog($cursor, 'ITEM');
            if ($apiResponse->isSuccess()) {
                $listCatalogResponse = $apiResponse->getResult();
                $items = array_merge($items, $listCatalogResponse->getObjects());
                $cursor = $listCatalogResponse->getCursor();
            } else {
                throw new \Exception('Error fetching Square items: ' . json_encode($apiResponse->getErrors()));
            }
        } while ($cursor);

        return $items;
    }

    private function fetchSquareItemOptions($catalogApi)
    {
        $cursor = null;
        $options = [];

        do {
            $apiResponse = $catalogApi->listCatalog($cursor, 'ITEM_OPTION');
            if ($apiResponse->isSuccess()) {
                $listCatalogResponse = $apiResponse->getResult();
                foreach ($listCatalogResponse->getObjects() as $option) {
                    $options[$option->getId()] = $option->getItemOptionData()->getName();
                }
                $cursor = $listCatalogResponse->getCursor();
            } else {
                throw new \Exception('Error fetching Square item options: ' . json_encode($apiResponse->getErrors()));
            }
        } while ($cursor);

        return $options;
    }

    private function fetchSquareItemOptionValues($catalogApi)
    {
        $cursor = null;
        $optionValues = [];

        do {
            $apiResponse = $catalogApi->listCatalog($cursor, 'ITEM_OPTION_VAL');
            if ($apiResponse->isSuccess()) {
                $listCatalogResponse = $apiResponse->getResult();
                foreach ($listCatalogResponse->getObjects() as $valueObject) {
                    $optionId = $valueObject->getItemOptionValueData()->getItemOptionId();
                    $valueId = $valueObject->getId();
                    $valueName = $valueObject->getItemOptionValueData()->getName();
                    $optionValues[$optionId][$valueId] = $valueName;
                }
                $cursor = $listCatalogResponse->getCursor();
            } else {
                throw new \Exception('Error fetching Square item option values: ' . json_encode($apiResponse->getErrors()));
            }
        } while ($cursor);

        return $optionValues;
    }

    public function getAllSquareCategories()
    {
        try {
            $apiResponse = $this->square->getCatalogApi()->listCatalog('', 'CATEGORY');

            if ($apiResponse->isSuccess()) {
                $catalogObjects = $apiResponse->getResult()->getObjects();
                $categories = [];

                foreach ($catalogObjects as $object) {
                    if ($object->getType() === 'CATEGORY') {
                        $categories[$object->getId()] = $object->getCategoryData()->getName();
                    }
                }

                return $categories;
            } else {
                throw new \Exception('Error fetching Square categories: ' . json_encode($apiResponse->getErrors()));
            }
        } catch (\Exception $e) {
            error_log('Error in SquareInventory::getAllSquareCategories: ' . $e->getMessage());
            return ['error' => 'Failed to retrieve categories from Square.'];
        }
    }
}
