import { useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { toast } from "react-toastify";

import Actions from "../components/features/inventory/Actions";
import InvEmptyState from "../components/features/inventory/InvEmptyState";
import InvLoading from "../components/features/inventory/InvLoading";
import InventoryTable from "../components/features/inventory/InventoryTable";
import { useDispatch, useSelector } from "react-redux";
import { setInventory } from "../redux/inventorySlice";

export default function Inventory() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);
  const [loading, setLoading] = useState(false);

  const getInventory = async () => {
    setLoading(true);
    let id = toast.loading("Retrieving square inventory");

    try {
      const response = await apiFetch({ path: "/sws/v1/square-inventory" });
      toast.update(id, {
        render: "Inventory received",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      console.log(response);
      dispatch(setInventory(response));
    } catch (error) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: false,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Actions />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-10">
        {inventory.length < 1 && !loading && (
          <InvEmptyState {...{ getInventory }} />
        )}
        {loading && <InvLoading />}
        {inventory.length > 0 && !loading && (
          <InventoryTable {...{ inventory, getInventory }} />
        )}
      </div>
    </>
  );
}
{
  /* {item.item_data.variations.length > 1 &&
                    item.item_data.variations.map((variation) => {
                      return (
                        <tr key={variation.id}>
                          <td className="py-1 pl-4 pr-8 sm:pl-6 lg:pl-8">
                            {variation.item_variation_data.sku}
                          </td>
                          <td className="py-1 pl-4 pr-8 sm:pl-6 lg:pl-8">
                            <div className="flex items-center gap-x-4">
                           
                              <div className="truncate text-sm font-medium leading-6 text-gray-900">
                                {variation.item_variation_data.name}
                              </div>
                            </div>
                          </td>
                          <td className="py-1">Variation</td>
                          <td className="py-1 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20"></td>
                          <td className="hidden py-1 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8"></td>
                        </tr>
                      );
                    })} */
}
