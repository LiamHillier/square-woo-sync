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
  ArrowLeftCircleIcon,
  ArrowPathIcon,
  ArrowRightCircleIcon,
  ArrowSmallLeftIcon,
  ArrowsRightLeftIcon,
  XCircleIcon,
  XMarkIcon,
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
import { range } from "lodash";

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
  const [steps, setSteps] = useState([
    { name: "Step 1", href: "#", status: "current" },
    { name: "Step 2", href: "#", status: "upcoming" },
    { name: "Step 3", href: "#", status: "upcoming" },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
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

  const [sseConnection, setSseConnection] = useState(null);

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
      const batches = [];
      for (let i = 0; i < array.length; i += batchSize) {
        const batch = array.slice(i, i + batchSize);
        batches.push(batch);
      }
      return batches;
    };

    // Define the batch size, adjust as needed
    const batchSize = rangeValue; // Example batch size
    const batches = createBatches(productsToImport, rangeValue);

    let curBatch = 0;
    for (const batch of batches) {
      try {
        const importPromises = batch.map(async (product) => {
          try {
            const res = await processProductImport(product);

            if (res.error) {
              console.log(res.error);
              return res.error;
            } else {
              setProgress((preProgress) => [...preProgress, res[0]]);
              return res[0];
            }
          } catch (error) {
            console.error(`Error importing product ${product.id}:`, error);
            return error;
          }
        });

        const results = await Promise.all(importPromises);
        console.log(results);
        curBatch++; // Increment the batch number for each iteration
        setProgress((preProgress) => [
          ...preProgress,
          "Completed Batch " + curBatch.toString() + "/" + batches.length,
        ]);
        const updatedTableData = inventory.map((inv) => {
          if (results.some((res) => res.square_id === inv.id)) {
            const matchedItem = results.find((res) => res.square_id === inv.id);
            return {
              ...inv,
              woocommerce_product_id:
                matchedItem.woocommerce_product_id || null,
              imported: matchedItem.status === "success" ? true : false,
              status: matchedItem.status,
              item_data: {
                ...inv.item_data,
                variations: [
                  ...inv.item_data.variations.map((variation) => {
                    return {
                      ...variation,
                      imported: matchedItem.status === "success" ? true : false,
                      status: matchedItem.status,
                    };
                  }),
                ],
              },
            };
          }
          return inv;
        });
        dispatch(setInventory(updatedTableData));
      } catch (error) {
        console.error("Batch Import Error:", error);
      }
    }

    // Resetting states after all batches are processed
    setLoadingProductId(null);
    resetTablePageIndex();
    setIsImporting(false);
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

  const handleRangeChange = (event) => {
    setRangeValue(Number(event.target.value));
  };

  const handleStepChange = (direction) => {
    setCurrentStep((prev) => {
      // Check if moving forward
      if (direction === "forward" && prev < steps.length - 1) {
        return prev + 1;
      }
      // Check if moving backward
      else if (direction === "backward" && prev > 0) {
        return prev - 1;
      }
      return prev; // Return current step if no change is possible
    });
  };

  return (
    <div>
      <DialogWrapper
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="w-6/12 max-w-lg mx-auto"
      >
        <div className="">
          <header className="flex justify-between items-center gap-2 mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Import from Square
            </h3>
            <nav
              className="flex items-center justify-center"
              aria-label="Progress"
            >
              <p className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </p>
              <ol role="list" className="ml-8 flex items-center space-x-5">
                {steps.map((step, idx) => (
                  <li key={step.name}>
                    {step.status === "complete" ? (
                      <span className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900">
                        <span className="sr-only">{step.name}</span>
                      </span>
                    ) : currentStep === idx ? (
                      <span
                        className="relative flex items-center justify-center"
                        aria-current="step"
                      >
                        <span
                          className="absolute flex h-5 w-5 p-px"
                          aria-hidden="true"
                        >
                          <span className="h-full w-full rounded-full bg-indigo-200" />
                        </span>
                        <span
                          className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{step.name}</span>
                      </span>
                    ) : (
                      <span className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
                        <span className="sr-only">{step.name}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </header>
          {currentStep === 0 && (
            <div>
              <h4 className="text-base mb-4">
                Select the data you wish to import / sync:
              </h4>
              <fieldset className="mb-3">
                <legend className="sr-only">data to sync</legend>
                <div className="flex gap-x-6 gap-y-4 items-start flex-wrap">
                  <label
                    htmlFor="title"
                    className="flex items-center gap-1 leading-none"
                  >
                    <input
                      type="checkbox"
                      required
                      checked={dataToImport.title}
                      disabled
                      id="title"
                      className="h-full !m-0"
                    />
                    Title
                  </label>
                  <label
                    htmlFor="SKU"
                    className="flex items-center gap-1 leading-none"
                  >
                    <input
                      type="checkbox"
                      required
                      checked={dataToImport.sku}
                      disabled
                      id="SKU"
                      className="h-full !m-0"
                    />
                    SKU
                  </label>
                  <label
                    htmlFor="price"
                    className="flex items-center gap-1 leading-none"
                  >
                    <input
                      type="checkbox"
                      id="price"
                      className="h-full !m-0"
                      checked={dataToImport.price}
                      onChange={() =>
                        setDataToImport({
                          ...dataToImport,
                          price: !dataToImport.price,
                        })
                      }
                    />
                    Price
                  </label>
                  <label
                    htmlFor="description"
                    className="flex items-center gap-1 leading-none"
                  >
                    <input
                      type="checkbox"
                      id="description"
                      checked={dataToImport.description}
                      onChange={() =>
                        setDataToImport({
                          ...dataToImport,
                          description: !dataToImport.description,
                        })
                      }
                      className="h-full !m-0"
                    />
                    Description
                  </label>
                  <label
                    htmlFor="image"
                    className="flex items-center gap-1 leading-none"
                  >
                    <input
                      type="checkbox"
                      id="image"
                      className="h-full !m-0"
                      checked={dataToImport.image}
                      onChange={() =>
                        setDataToImport({
                          ...dataToImport,
                          image: !dataToImport.image,
                        })
                      }
                    />
                    Image
                  </label>
                  <label
                    htmlFor="categories"
                    className="flex items-center gap-1 leading-none"
                  >
                    <input
                      type="checkbox"
                      id="categories"
                      className="h-full !m-0"
                      checked={dataToImport.categories}
                      onChange={() =>
                        setDataToImport({
                          ...dataToImport,
                          categories: !dataToImport.categories,
                        })
                      }
                    />
                    Categories
                  </label>
                  <label
                    htmlFor="stock"
                    className="flex items-center gap-1 leading-none"
                  >
                    <input
                      type="checkbox"
                      id="stock"
                      className="h-full !m-0"
                      checked={dataToImport.stock}
                      onChange={() =>
                        setDataToImport({
                          ...dataToImport,
                          stock: !dataToImport.stock,
                        })
                      }
                    />
                    Stock
                  </label>
                </div>
              </fieldset>
              <p>
                Existing products will have their data updated, while new
                entries will be created for products not already in the system.
              </p>
              <h4 className="text-base mt-4 mb-2">
                How many products to import in each batch?
              </h4>
              <p>
                Increasing the number in each batch places a greater load on the
                server (especially when import images). If you encounter errors,
                consider reducing this value for better stability or disabling
                image import.
              </p>

              <div className="relative mb-6 mt-3">
                <label htmlFor="labels-range-input" className="sr-only">
                  Labels range
                </label>
                <input
                  id="labels-range-input"
                  type="range"
                  value={rangeValue}
                  onChange={handleRangeChange}
                  step={5}
                  min="5"
                  max="50"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-500 absolute start-0 -bottom-6">
                  Min 5
                </span>
                {/* Display the current value */}
                <span className="text-sm text-gray-600 font-semibold absolute start-1/2 -translate-x-1/2 -bottom-6">
                  {rangeValue}
                </span>
                <span className="text-sm text-gray-500 absolute end-0 -bottom-6">
                  Max 50
                </span>
              </div>
              <div className="flex items-center mt-10 justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(0);
                    setIsDialogOpen(false);
                  }}
                  className="relative inline-flex items-center rounded-md bg-gray-400 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
                >
                  <span>Cancel</span>
                  <XCircleIcon
                    className="ml-1.5 h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleStepChange("forward")}
                  className="relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
                >
                  <span>Continue</span>
                  <ArrowRightCircleIcon
                    className="ml-1.5 h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <h4 className="text-base mb-4">Review</h4>
              <p>
                You are about to import{" "}
                <span className="font-semibold">{productsToImport.length}</span>{" "}
                products in batches of{" "}
                <span className="font-semibold">{rangeValue}</span>. Existing
                products will have their data updated, while new entries will be
                created for products not already in the system.
              </p>
              <p className="mt-2">
                You have chosen to import/sync the following:
                <ul className="flex gap-2 mt-2 flex-wrap">
                  {Object.keys(dataToImport).map((key) => {
                    if (dataToImport[key]) {
                      return (
                        <li className="p-2 border border-gray-300 uppercase text-xs font-semibold">
                          {key}
                        </li>
                      );
                    }
                  })}
                </ul>
              </p>
              <div className="flex items-center mt-10 justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleStepChange("backward")}
                  className="relative inline-flex items-center rounded-md bg-gray-400 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
                >
                  <ArrowLeftCircleIcon
                    className="mr-1.5 h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                  <span>Go back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStepChange("forward");
                    importProduct();
                  }}
                  className="relative inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
                >
                  <span>IMPORT</span>
                  <ArrowRightCircleIcon
                    className="ml-1.5 h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <div>
                <div className="">
                  {/* Progress bar */}
                  <div className="h-4 bg-gray-200 w-full rounded-lg mt-2">
                    <div
                      className="h-full bg-blue-500 rounded-lg"
                      style={{
                        width: `${
                          (progress.filter((prg) => typeof prg !== "string")
                            .length /
                            importCount) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  {/* Progress text */}
                  <div className="text-sm text-gray-500 mt-1">
                    Imported{" "}
                    {progress.filter((prg) => typeof prg !== "string").length}{" "}
                    of {importCount} products
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
                          prog.status && prog.status === "success"
                            ? "text-green-500"
                            : prog.status && prog.status === "failed"
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                        key={prog.square_id || prog}
                      >
                        {JSON.stringify(prog)}
                      </p>
                    );
                  })}
                </div>
              </div>
              {!isImporting && (
                <div className="flex items-center justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setCurrentStep(0);
                    }}
                    className="relative inline-flex items-center rounded-md bg-gray-400 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400"
                  >
                    <XCircleIcon
                      className="mr-1.5 h-4 w-4 text-white"
                      aria-hidden="true"
                    />
                    <span>Close</span>
                  </button>
                </div>
              )}
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
                setProductsToImport(reformattedData);
                setIsDialogOpen(true);
              }}
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
