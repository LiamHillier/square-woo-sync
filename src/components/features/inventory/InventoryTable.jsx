import { useMemo, useState } from "@wordpress/element";
import {
  getSortedRowModel,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "../../../utils/classHelper";
import DebouncedInput from "../../DebouncedInput";

function reformatDataForTable(inventory) {
  return inventory.map((item) => {
    const variations = item.item_data.variations.map((variation) => ({
      sku: variation.item_variation_data.sku,
      name: variation.item_variation_data.name, // Assuming you want to use the main item's name
      type: "variation",
      price: variation.item_variation_data.price_money.amount / 100,
      categories: item.item_data.category_name,
      status: variation.imported,
    }));

    const price = item.item_data.variations.map(
      (v) => v.item_variation_data.price_money.amount / 100
    );
    let minAmount = Math.min(...price);
    let maxAmount = Math.max(...price);

    return {
      sku: item.item_data.variations[0].item_variation_data.sku,
      name: item.item_data.name,
      type: item.item_data.variations.length > 1 ? "Variable" : "Simple",
      price:
        minAmount === maxAmount
          ? `$${minAmount}`
          : `$${minAmount} - $${maxAmount}`,
      categories: item.item_data.category_name,
      status: item.item_data.variations[0].imported,
      ...(variations.length > 1 && { subRows: variations }),
    };
  });
}

const filterRows = (row, id, value) => {
  // Check for the existence of 'values' and then 'id' in the main row
  const mainRowMatch = row.getValue(id)
    ? row.getValue(id).toString().toLowerCase().includes(value.toLowerCase())
    : false;

  // Check if any subrow matches the filter value
  const subRowMatch =
    row.subRows &&
    row.subRows.some((subRow) => {
      const subRowValue = subRow.getValue(id);
      return subRowValue
        ? subRowValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    });
  return mainRowMatch || subRowMatch;
};

const InventoryTable = ({ inventory, getInventory }) => {
  // Data and columns configuration
  const columns = useMemo(
    () => [
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
        accessorKey: "sku",
        header: () => "SKU",
        canSort: true,
      },
      {
        accessorKey: "name",
        header: () => "Product Name",
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
          return (
            <span
              className={`inline-flex items-center gap-x-1.5 rounded-md  px-2 py-1 text-xs font-medium  ${
                getValue()
                  ? "bg-green-100 text-green-700"
                  : "text-red-700 bg-red-100"
              }`}
            >
              <svg
                className={`h-1.5 w-1.5 ${
                  getValue() === false ? "fill-red-500" : "fill-green-500"
                }`}
                viewBox="0 0 6 6"
                aria-hidden="true"
              >
                <circle cx={3} cy={3} r={3} />
              </svg>
              {getValue() === false ? "Not imported" : "imported"}
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <button
              type="button"
              className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              import
            </button>
          );
        },
      },
    ],
    []
  );

  const [expanded, setExpanded] = useState({});
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const reformattedData = useMemo(
    () => reformatDataForTable(inventory),
    [inventory]
  );

  const table = useReactTable({
    data: reformattedData,
    columns,
    state: {
      expanded,
      sorting,
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
  });

  return (
    <div>
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
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
        </div>
      </div>
      <div className="sm:px-6 lg:px-8 relative overflow-hidden w-full">
        <table className="w-full min-w-full whitespace-nowrap text-left bg-white">
          <thead className="border-b border-gray-900/10 text-sm leading-6 text-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th
                    {...{
                      onClick: header.column.getToggleSortingHandler(),
                      key: header.id,
                      colSpan: header.colSpan,
                      className: "py-2 font-bold select-none",
                      style: {
                        width: idx == 0 ? "50px" : "150px",
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-end gap-1 leading-none capitalize">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span>
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "desc" ? (
                              <ChevronDownIcon className="w-3 h-3" />
                            ) : (
                              <ChevronUpIcon className="w-3 h-3" />
                            )
                          ) : header.column.getCanSort() ? (
                            <ChevronRightIcon className="w-3 h-3" />
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => {
              // Determine if the row is expanded
              const isSubRow = row.original.type === "variation";
              const isExpanded = row.getIsExpanded();
              // Conditional class names for sub-rows
              const rowClassNames = isSubRow
                ? "py-4 wrap bg-indigo-50" // Example style for sub-rows
                : "py-4 wrap";

              return (
                <tr
                  key={row.id}
                  className={classNames(
                    rowClassNames,
                    isExpanded ? "bg-indigo-300" : ""
                  )}
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    return (
                      <td
                        key={cell.id}
                        className={`py-4 wrap text-gray-600 ${
                          idx === row.getVisibleCells().length - 1
                            ? "text-right pr-4"
                            : "text-left"
                        } `}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <hr />
      <div className="flex items-center gap-2 px-4 py-5 sm:px-6">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InventoryTable;
