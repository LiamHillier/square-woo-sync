import { useMemo, useState, useRef, useEffect } from "@wordpress/element";
import { useNavigate } from "react-router-dom";
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
import DebouncedInput from "../../../DebouncedInput";
import apiFetch from "@wordpress/api-fetch";
import { useSelector, useDispatch } from "react-redux";
import { setInventory } from "../../../../redux/inventorySlice";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import PaginationControls from "./PaginationControls";
import { reformatDataForTable } from "../../../../utils/formatTableData";
import { filterRows } from "../../../../utils/filterRows";
import { classNames } from "../../../../utils/classHelper";
import { useNavigationBlocker } from "../../../NavigationContext";
import ImportDialog from "../import/ImportDialog";

const controller =
  typeof AbortController === "undefined" ? undefined : new AbortController();

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

const InventoryTable = ({ getInventory }) => {
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);
  const [progress, setProgress] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [productsToImport, setProductsToImport] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const [dataToImport, setDataToImport] = useState({
    title: true,
    sku: true,
    description: true,
    stock: true,
    image: true,
    categories: true,
    price: true,
  });
  const [rangeValue, setRangeValue] = useState(15);
  // In your component render function:
  const reformattedData = useMemo(
    () => reformatDataForTable(inventory),
    [inventory]
  );

  const [columnVisibility] = useState({
    id: false,
  });

  const importProduct = async () => {
    if (isImporting) {
      return;
    }

    setImportCount(productsToImport.length);
    setProgress([]);
    setIsImporting(true);
    setIsDialogOpen(true);

    // Function to create batches
    const createBatches = (array, batchSize) => {
      return array.reduce(
        (acc, _, i) =>
          i % batchSize ? acc : [...acc, array.slice(i, i + batchSize)],
        []
      );
    };

    const batches = createBatches(productsToImport, rangeValue);
    let results = [];
    let curBatch = 0;

    const processBatch = async (batch) => {
      const importPromises = batch.map((product) =>
        processSingleProduct(product)
      );
      const batchResults = await Promise.all(importPromises);
      results = [...results, ...batchResults];
      updateProgressForBatch(++curBatch, batches.length);
    };

    const processSingleProduct = async (product) => {
      try {
        const res = await processProductImport(product);
        const result = res.error
          ? {
              status: "failed",
              product_id: "N/A",
              square_id: product.id,
              message: res.error,
            }
          : res[0];
        updateProgress(result);
        return result;
      } catch (error) {
        const errorMsg =
          error.name === "AbortError" ? "Request Aborted" : error.message;
        console.error(`Error importing product ${product.id}:`, errorMsg);
        const errorResult = {
          status: "failed",
          product_id: "N/A",
          square_id: product.id,
          message: errorMsg,
        };
        updateProgress(errorResult);
        return errorResult;
      }
    };

    const updateProgress = (result) => {
      setProgress((prevProgress) => [...prevProgress, result]);
    };

    const updateProgressForBatch = (current, total) => {
      setProgress((prevProgress) => [
        ...prevProgress,
        `Completed Batch ${current}/${total}`,
      ]);
    };

    for (const batch of batches) {
      try {
        await processBatch(batch);
      } catch (error) {
        console.error("Batch Import Error:", error);
        const errorResult = { status: "failed", message: error.message };
        updateProgress(errorResult);
      }
    }

    const updatedTableData = updateInventoryTable(results);
    if (updatedTableData) {
      dispatch(setInventory(updatedTableData));
    }
    setLoadingProductId(null);
    resetTablePageIndex();
    setIsImporting(false);
  };

  const updateInventoryTable = (results) => {
    return inventory.map((inv) => {
      const matchedItem = results.find((res) => res.square_id === inv.id);
      const importStatus = matchedItem
        ? matchedItem.status === "success"
        : false;

      return {
        ...inv,
        woocommerce_product_id: matchedItem?.product_id || null,
        imported: importStatus,
        status: matchedItem?.status,
        item_data: {
          ...inv.item_data,
          variations: inv.item_data.variations.map((variation) => ({
            ...variation,
            imported: importStatus,
            status: matchedItem?.status,
          })),
        },
      };
    });
  };

  async function processProductImport(product) {
    const inventoryMatch = inventory.find((inv) => inv.id === product.id);

    if (!inventoryMatch) {
      return { error: `Product ${product.id} not found in inventory` };
    }

    try {
      return await apiFetch({
        path: "/sws/v1/square-inventory/import",
        signal: controller?.signal,
        method: "POST",
        data: { product: [inventoryMatch], datatoimport: dataToImport },
      });
    } catch (error) {
      return { error: error };
    }
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
              <button type="button">
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
            <div className="group relative w-10 h-10">
              {value.map((url, idx) => {
                return (
                  <img
                    key={idx}
                    src={url}
                    width={40}
                    height={40}
                    className={classNames(
                      "w-10 h-10 rounded object-cover flex items-center gap-2 shadow top-0 absolute transition-transform duration-300",
                      idx === 0 &&
                        value.length > 1 &&
                        "group-hover:-translate-y-2 rotate-12 group-hover:rotate-[-16deg]",
                      idx === 1 &&
                        value.length > 1 &&
                        "group-hover:translate-y-2 group-hover:rotate-[16deg]"
                    )}
                  />
                );
              })}
            </div>
          );
        } else {
          return (
            <div className=" gap-2 w-10 h-10 rounded bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center">
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
      accessorKey: "stock",
      canSort: true,
      header: () => "Stock",
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
                target="_blank"
              >
                View Product
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setIsDialogOpen(true);
                setProductsToImport([row.original]);
              }}
              disabled={isImporting}
              className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {row.original.status === true ? "Sync" : "Import"}
            </button>
          </div>
        );
      },
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center w-full pl-2">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: ({ row }) => {
        if (!row.parentId) {
          return (
            <div className="px-1">
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          );
        }
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
      rowSelection,
    },
    filterFns: {
      custom: filterRows,
    },
    onExpandedChange: setExpanded,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

  const getSelectedRowData = () => {
    // Get the IDs of selected rows
    const selectedRowIds = Object.keys(rowSelection).filter(
      (rowId) => rowSelection[rowId]
    );

    // Filter the data to get the selected rows' data
    const selectedRowsData = reformattedData.filter((row) =>
      selectedRowIds.includes(row.id)
    );

    return selectedRowsData;
  };

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (isImporting) {
        e.preventDefault();
        e.returnValue = "";
      }
    }

    if (isImporting) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isImporting]);

  const navigate = useNavigate();
  const { blockNavigation, setBlockNavigation } = useNavigationBlocker();

  // When the import starts
  useEffect(() => {
    if (isImporting) {
      setBlockNavigation(true);
    } else {
      setBlockNavigation(false);
    }
  }, [isImporting, setBlockNavigation]);

  return (
    <div>
      <ImportDialog
        dataToImport={dataToImport}
        setDataToImport={setDataToImport}
        importCount={importCount}
        importProduct={importProduct}
        controller={controller}
        isImporting={isImporting}
        productsToImport={productsToImport}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        isDialogOpen={isDialogOpen}
        progress={progress}
        setIsDialogOpen={setIsDialogOpen}
      />
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
              className="block w-full rounded-md border-0 py-1.5 pr-14 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              onClick={() => {
                const selectedData = getSelectedRowData();
                if (selectedData.length > 0) {
                  setProductsToImport(selectedData);
                } else {
                  setProductsToImport(reformattedData);
                }
                setIsDialogOpen(true);
              }}
              className="relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
            >
              <ArrowDownOnSquareStackIcon
                className="-ml-0.5 mr-1.5 h-4 w-4 text-white"
                aria-hidden="true"
              />
              <span>
                {Object.keys(rowSelection).length < 1
                  ? "Import all"
                  : "Import selected products"}
              </span>
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
                toggleExpanded={() => {
                  if (!row.getCanExpand()) return;
                  row.toggleExpanded();
                }}
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
