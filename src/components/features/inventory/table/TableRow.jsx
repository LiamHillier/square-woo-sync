import { flexRender } from "@tanstack/react-table";
import { classNames } from "../../../../utils/classHelper";

const TableRow = ({ row, loadingProductId }) => {
  const isSubRow = row.original.type === "variation";
  const isExpanded = row.getIsExpanded();
  const isLoading = row.original.id === loadingProductId;

  const rowClassNames = classNames(
    isSubRow ? "bg-indigo-50" : "", // Example style for sub-rows
    isLoading ? "bg-gray-100" : "", // Style for loading rows
    "py-4 wrap"
  );
  return (
    <tr
      key={row.id}
      className={classNames(rowClassNames, isExpanded ? "bg-indigo-300" : "")}
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
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
