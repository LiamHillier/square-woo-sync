import { useMemo, useState, useRef, useEffect } from "@wordpress/element";
import { toast } from "react-toastify";
import {
  getSortedRowModel,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  ArrowDownOnSquareStackIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import DebouncedInput from "../../DebouncedInput";
import apiFetch from "@wordpress/api-fetch";
import { useSelector, useDispatch } from "react-redux";
import { setInventory } from "../../../redux/inventorySlice";
import TableHeader from "./table/TableHeader";
import TableRow from "./table/TableRow";
import PaginationControls from "./table/PaginationControls";
import { reformatDataForTable } from "../../../utils/formatTableData";
import { filterRows } from "../../../utils/filterRows";
import DialogWrapper from "../../Dialog";

const InventoryTable = ({ getInventory }) => {
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);
  const [tableData, setTableData] = useState(inventory);
  const [progress, setProgress] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // In your component render function:
  const reformattedData = useMemo(
    () => reformatDataForTable(inventory),
    [inventory]
  );

  const [columnVisibility] = useState({
    id: false,
  });

  const [sseConnection, setSseConnection] = useState(null);

  const importProduct = async (productArr) => {
    if (isImporting) {
      return;
    }
    console.log(productArr.length);
    setImportCount(productArr.length);
    setProgress([]);
    setIsImporting(true);
    setIsDialogOpen(true);

    try {
      const importPromises = productArr.map(async (product) => {
        const toastId = toast.loading(`Importing product ${product.id}`);
        const res = await processProductImport(product);

        if (res.error) {
          toast.update(toastId, createToastConfig("error", res.error));
        } else {
          // Update the table data with the latest data
          setProgress((preProgress) => [...preProgress, res[0]]);
          toast.update(
            toastId,
            createToastConfig("success", `Product ${product.id} imported`)
          );
          return res[0];
        }
      });

      const results = await Promise.all(importPromises);
      console.log(results);
    } catch (error) {
      console.error("Import Product Error:", error);
    } finally {
      setLoadingProductId(null);
      resetTablePageIndex();
      setIsImporting(false);
    }
  };

  async function processProductImport(product) {
    const inventoryMatch = inventory.find((inv) => inv.id === product.id);

    if (!inventoryMatch) {
      return { error: `Product ${product.id} not found in inventory` };
    }

    try {
      return await apiFetch({
        path: "/sws/v1/square-inventory/import",
        method: "POST",
        data: { product: [inventoryMatch] },
      });
    } catch (error) {
      return { error: error.message };
    }
  }

  function createToastConfig(type, message) {
    return {
      render: message,
      type: type,
      isLoading: false,
      autoClose: type === "success" ? 2000 : false,
      closeOnClick: true,
    };
  }

  function resetTablePageIndex() {
    const currentPageIndex = table.getState().pagination.pageIndex;
    table.setPageIndex(currentPageIndex);
  }
  // Data and columns configutraion
  const columns = [
    {
      id: "expander",
      width: 50,
      cell: ({ row }) => {
        return (
          <>
            {row.getCanExpand() ? (
              <button onClick={() => row.toggleExpanded()}>
                {row.getIsExpanded() ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 rotate-90"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
            ) : (
              <>
                {row.subRows.length > 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-indigo-500 pl-2"
                  >
                    <polyline points="15 10 20 15 15 20" />
                    <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                  </svg>
                )}
              </>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => "id",
      show: false,
    },
    {
      accessorKey: "sku",
      header: () => "SKU",
      canSort: true,
    },
    {
      accessorKey: "image",
      header: () => "",
      enableSorting: false,
      width: 50,
      cell: ({ getValue }) => {
        const value = getValue();
        if (value) {
          return (
            <div className="flex items-center gap-2">
              <img
                src={value}
                width={40}
                height={40}
                className="w-10 h-10 rounded object-cover flex items-center gap-2 shadow"
              />
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2 w-10 h-10 rounded bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
          );
        }
      },
    },
    {
      accessorKey: "name",
      header: () => "Name",
      canSort: true,
    },
    {
      accessorKey: "type",
      header: () => "Type",
      canSort: true,
    },
    {
      accessorKey: "price",
      canSort: true,
      header: () => "Price",
    },
    {
      accessorKey: "categories",
      header: () => "categories",
      canSort: true,
    },
    {
      accessorKey: "status",
      canSort: true,
      header: () => "Status",
      cell: ({ getValue }) => {
        const value = getValue();
        let bgColor, textColor, fillColor;

        if (value === false) {
          bgColor = "bg-red-100";
          textColor = "text-red-700";
          fillColor = "fill-red-500";
        } else if (value === "partial") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-700";
          fillColor = "fill-yellow-500";
        } else {
          bgColor = "bg-green-100";
          textColor = "text-green-700";
          fillColor = "fill-green-500";
        }

        return (
          <span
            className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${bgColor} ${textColor}`}
          >
            <svg
              className={`h-1.5 w-1.5 ${fillColor}`}
              viewBox="0 0 6 6"
              aria-hidden="true"
            >
              <circle cx={3} cy={3} r={3} />
            </svg>
            {value === false
              ? "Not imported"
              : value === "partial"
              ? "Partial"
              : "Imported"}
          </span>
        );
      },
    },
    {
      id: "actions",
      colSpan: 2,
      cell: ({ row }) => {
        if (row.parentId) return <></>;
        return (
          <div className="flex items-center justify-end gap-2">
            {row.original.woocommerce_product_id && (
              <a
                className="rounded bg-purple-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-purple-500 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 cursor-pointer"
                href={`/wp-admin/post.php?post=${row.original.woocommerce_product_id}&action=edit`}
              >
                View Product
              </a>
            )}
            <button
              type="button"
              onClick={() => importProduct([row.original])}
              disabled={isImporting}
              className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {row.original.status === true ? "Sync" : "Import"}
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: reformattedData,
    columns,
    state: {
      expanded,
      sorting,
      columnVisibility,
      globalFilter,
    },
    filterFns: {
      custom: filterRows,
    },
    onExpandedChange: setExpanded,
    globalFilterFn: "custom",
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    getRowId: (row) => row.id,
  });

  // Inside your component...
  const loggerContainerRef = useRef(null);

  // Use useEffect to scroll to the bottom when new content is added
  useEffect(() => {
    if (loggerContainerRef.current) {
      loggerContainerRef.current.scrollTop =
        loggerContainerRef.current.scrollHeight;
    }
  }, [progress]);

  const handleDialogClose = () => {
    console.log("test");
    setIsDialogOpen(false);
  };

  return (
    <div>
      <DialogWrapper
        title="Importing products"
        description=""
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="w-5/12 max-w-lg mx-auto"
      >
        <div className="">
          <div className="">
            {/* Progress bar */}
            <div className="h-4 bg-gray-200 w-full rounded-lg mt-2">
              <div
                className="h-full bg-blue-500 rounded-lg"
                style={{
                  width: `${(progress.length / importCount) * 100}%`,
                }}
              ></div>
            </div>
            {/* Progress text */}
            <div className="text-sm text-gray-500 mt-1">
              Imported {progress.length} of {importCount} products
            </div>
          </div>
          {/* Logger container with scroll */}
          <div
            ref={loggerContainerRef}
            className="bg-slate-950 p-4 rounded-xl max-h-52 overflow-y-auto overflow-x-hidden w-full flex flex-col gap-2 mt-2"
          >
            {progress.map((prog, index) => {
              return (
                <p
                  className={`break-words ${
                    prog.status === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                  key={prog.square_id}
                >
                  {JSON.stringify(prog)}
                </p>
              );
            })}
          </div>
          {/* Buttons */}
          {!isImporting && (
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleDialogClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </DialogWrapper>

      <div className="px-4 py-5 sm:px-6">
        <div className="grid grid-cols-3 gap-2 mb-4 items-center">
          <div className="flex flex-wrap items-center justify-start sm:flex-nowrap">
            <h2 className="text-base font-semibold leading-7 text-gray-900 ">
              Square Inventory
            </h2>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                onClick={getInventory}
                className="relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
              >
                <ArrowPathIcon
                  className="-ml-0.5 mr-1.5 h-4 w-4 text-white"
                  aria-hidden="true"
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="relative flex">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(value)}
              className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search inventory..."
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-search w-3 h-3"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </kbd>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <button
              type="button"
              onClick={() => importProduct(reformattedData)}
              className="relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
            >
              <ArrowDownOnSquareStackIcon
                className="-ml-0.5 mr-1.5 h-4 w-4 text-white"
                aria-hidden="true"
              />
              <span>Import All</span>
            </button>
          </div>
        </div>
      </div>
      <div className="sm:px-6 lg:px-8 relative overflow-hidden w-full">
        <table className="w-full min-w-full whitespace-nowrap text-left bg-white">
          <TableHeader table={table} />
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                loadingProductId={loadingProductId}
              />
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <PaginationControls table={table} />
    </div>
  );
};

export default InventoryTable;
