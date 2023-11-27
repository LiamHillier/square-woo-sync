export function reformatDataForTable(inventory) {
  return inventory.map((item) => {
    const variations = (item.item_data?.variations || []).map((variation) => ({
      sku: variation.item_variation_data.sku,
      name: variation.item_variation_data.name, // Assuming you want to use the main item's name
      type: "variation",
      price: variation.item_variation_data.price_money.amount / 100,
      categories: item.item_data.category_name,
      status: variation.imported,
      id: variation.id,
      woocommerce_product_id: variation.woocommerce_product_id || null,
    }));

    const price = (item.item_data?.variations || []).map(
      (v) => v.item_variation_data.price_money.amount / 100
    );

    let minAmount, maxAmount;

    if (price.length > 0) {
      minAmount = Math.min(...price);
      maxAmount = Math.max(...price);
    } else {
      minAmount = maxAmount = 0;
    }

    return {
      sku: item.item_data?.variations[0]?.item_variation_data.sku || "",
      id: item.id,
      name: item.item_data?.name || "",
      image: item.item_data?.image_urls ? item.item_data.image_urls[0] : null,
      woocommerce_product_id: item.woocommerce_product_id || null,
      type:
        (item.item_data?.variations?.length || 0) > 1 ? "Variable" : "Simple",
      price:
        minAmount === maxAmount
          ? `$${minAmount}`
          : `$${minAmount} - $${maxAmount}`,
      categories: item.item_data?.category_name || "",
      status:
        (item.item_data?.variations?.length || 0) > 1
          ? variations.some((vari) => vari.status) &&
            !variations.every((vari) => vari.status)
            ? "partial"
            : variations.every((vari) => vari.status)
            ? true
            : false
          : item.imported,
      ...(variations.length > 1 && { subRows: variations }),
    };
  });
}
