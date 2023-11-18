import { ArchiveBoxIcon } from "@heroicons/react/20/solid";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";

export default function InvEmptyState({ getInventory }) {
  return (
    <div className="px-4 py-7 sm:px-6 flex items-center justify-center flex-col">
      <ArchiveBoxArrowDownIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        Square Inventory
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by loading your Square's inventory
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={getInventory}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArchiveBoxIcon
            className="-ml-0.5 mr-1.5 h-5 w-5"
            aria-hidden="true"
          />
          Load inventory
        </button>
      </div>
    </div>
  );
}
