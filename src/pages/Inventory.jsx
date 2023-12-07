/**
 * External dependencies
 */
import { useState, useCallback } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

/**
 * Internal dependencies
 */
import InvEmptyState from "../components/features/inventory/InvEmptyState";
import InvLoading from "../components/features/inventory/InvLoading";
import InventoryTable from "../components/features/inventory/table/InventoryTable";
import { setInventory } from "../redux/inventorySlice";

export default function Inventory() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);
  const [loading, setLoading] = useState(false);

  // Fetch inventory data and handle API response
  const getInventory = useCallback(async () => {
    setLoading(true);
    let id = toast.loading("Retrieving square inventory");

    try {
      const response = await apiFetch({
        path: "/sws/v1/square-inventory/",
      });
      toast.update(id, {
        render: "Inventory received",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
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
  }, [dispatch]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-10">
      {inventory.length < 1 && !loading && (
        <InvEmptyState getInventory={getInventory} />
      )}
      {loading && <InvLoading />}
      {inventory.length > 0 && !loading && (
        <InventoryTable getInventory={getInventory} />
      )}
    </div>
  );
}
