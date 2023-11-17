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
        // Create an instance of the Catalog API
        $catalogApi =  $this->square->getCatalogApi();

        // Fetch list of products (catalog items) from Square
        $cursor = null;
        $square_products = [];

        do {
            $apiResponse = $catalogApi->listCatalog($cursor, 'ITEM');

            if ($apiResponse->isSuccess()) {
                $listCatalogResponse = $apiResponse->getResult();
                $items = $listCatalogResponse->getObjects();
                $square_products = array_merge($square_products, $items);
                $cursor = $listCatalogResponse->getCursor();
            } else {
                error_log('Error fetching Square catalog page: ' . json_encode($apiResponse->getErrors()));
            }
        } while ($cursor);

        return $square_products;
    }

}
