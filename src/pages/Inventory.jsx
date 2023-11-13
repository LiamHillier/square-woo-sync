import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { classNames } from "../utils/classHelper";
import { EnvelopeIcon, ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import Actions from "../components/inventory/Actions";
const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const activityItems = [
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "2d89f0c8",
    branch: "main",
    status: "Completed",
    duration: "25s",
    date: "45 minutes ago",
    dateTime: "2023-01-23T11:00",
  },
  {
    user: {
      name: "Lindsay Walton",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "249df660",
    branch: "main",
    status: "Completed",
    duration: "1m 32s",
    date: "3 hours ago",
    dateTime: "2023-01-23T09:00",
  },
  {
    user: {
      name: "Courtney Henry",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "11464223",
    branch: "main",
    status: "Error",
    duration: "1m 4s",
    date: "12 hours ago",
    dateTime: "2023-01-23T00:00",
  },
  {
    user: {
      name: "Courtney Henry",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "dad28e95",
    branch: "main",
    status: "Completed",
    duration: "2m 15s",
    date: "2 days ago",
    dateTime: "2023-01-21T13:00",
  },
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "624bc94c",
    branch: "main",
    status: "Completed",
    duration: "1m 12s",
    date: "5 days ago",
    dateTime: "2023-01-18T12:34",
  },
  {
    user: {
      name: "Courtney Henry",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "e111f80e",
    branch: "main",
    status: "Completed",
    duration: "1m 56s",
    date: "1 week ago",
    dateTime: "2023-01-16T15:54",
  },
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "5e136005",
    branch: "main",
    status: "Completed",
    duration: "3m 45s",
    date: "1 week ago",
    dateTime: "2023-01-16T11:31",
  },
  {
    user: {
      name: "Whitney Francis",
      imageUrl:
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "5c1fd07f",
    branch: "main",
    status: "Completed",
    duration: "37s",
    date: "2 weeks ago",
    dateTime: "2023-01-09T08:45",
  },
];

export default function Inventory() {
  return (
    <>
      <Actions />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-20">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
            <h2 className="text-base font-semibold leading-7 text-gray-900 ">
              Sync log
            </h2>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
              >
                <ArrowsUpDownIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-white"
                  aria-hidden="true"
                />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap text-left bg-white">
            <colgroup>
              <col className="w-full lg:w-1/12" />
              <col className="w-full sm:w-4/12" />
              <col className="w-full lg:w-2/12" />
              <col className="w-full lg:w-1/12" />
              <col className="w-full lg:w-1/12" />
            </colgroup>
            <thead className="border-b border-gray-900/10 text-sm leading-6 text-gray-900">
              <tr>
                <th
                  scope="col"
                  className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                >
                  SKU
                </th>
                <th
                  scope="col"
                  className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                >
                  Product Name
                </th>
                <th
                  scope="col"
                  className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                >
                  Sync Direction
                </th>
                <th
                  scope="col"
                  className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                >
                  Created at
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activityItems.map((item) => (
                <tr key={item.commit} className="">
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">asdasd</td>
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center gap-x-4">
                      <img
                        src={item.user.imageUrl}
                        alt=""
                        className="h-8 w-8 rounded-full bg-gray-800"
                      />
                      <div className="truncate text-sm font-medium leading-6 text-gray-900">
                        {item.user.name}
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                    <div className="flex gap-2 items-center">
                      <div className="font-mono text-xs leading-6 text-white bg-black px-4 rounded-full">
                        square
                      </div>
                      <ArrowSmallRightIcon className="w-4 h-4" />
                      <div className="font-mono text-xs leading-6 text-white bg-purple-500 px-4 rounded-full">
                        woo
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                    <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                      <time
                        className="text-gray-400 sm:hidden"
                        dateTime={item.dateTime}
                      >
                        {item.date}
                      </time>
                      <div
                        className={classNames(
                          statuses[item.status],
                          "flex-none rounded-full p-1"
                        )}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      </div>
                      <div className="hidden text-gray-900 sm:block">
                        {item.status}
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                    <time dateTime={item.dateTime}>{item.date}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
