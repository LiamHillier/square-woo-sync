import { useEffect, useState, Fragment } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import {
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "../../../../utils/classHelper";
import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";

const activity = [
  {
    id: 1,
    type: "comment",
    person: { name: "Eduardo Benz", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago",
  },
  {
    id: 2,
    type: "assignment",
    person: { name: "Hilary Mahy", href: "#" },
    assigned: { name: "Kristin Watson", href: "#" },
    date: "2d ago",
  },
  {
    id: 3,
    type: "tags",
    person: { name: "Hilary Mahy", href: "#" },
    tags: [
      { name: "Bug", href: "#", color: "fill-red-500" },
      { name: "Accessibility", href: "#", color: "fill-indigo-500" },
    ],
    date: "6h ago",
  },
  {
    id: 4,
    type: "comment",
    person: { name: "Jason Meyers", href: "#" },
    imageUrl:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.",
    date: "2h ago",
  },
];

const SyncLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const getLogs = async () => {
      const response = await apiFetch({ path: "/sws/v1/logs", method: "GET" });
      setLogs(response.logs);
      console.log(response.logs);
    };
    getLogs();
  }, []);

  const levelColor = (level) => {
    switch (level) {
      case "info":
        return "text-blue-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-orange-600";
      default:
        return "text-white";
    }
  };

  const isValid = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <>
      <div className="flow-root bg-white rounded-lg shadow p-5  float-right">
        <h3 className="text-base font-semibold text-gray-900 mb-6 flex justify-start items-center gap-2">
          <ArrowsRightLeftIcon className="w-6 h-6" />
          Sync Feed
          <span className="text-xs text-gray-500 font-normal mt-[1px] -ml-1">
            {" "}
            - Shows last 50 logs
          </span>
        </h3>
        <ul role="list" className="max-h-screen overflow-auto">
          {logs.reverse().map((activityItem, activityItemIdx) => (
            <li key={activityItem.id}>
              <div className="relative pb-4">
                {activityItemIdx !== logs.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <>
                    <div>
                      <div className="relative px-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                          {activityItem.log_level === "success" ? (
                            <CheckCircleIcon
                              className="h-5 w-5 text-green-500"
                              aria-hidden="true"
                            />
                          ) : activityItem.log_level === "error" ? (
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <InformationCircleIcon
                              className="h-5 w-5 text-blue-500"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className="text-sm text-gray-500">
                        <p className="whitespace-nowrap text-xs">
                          {activityItem.timestamp}
                        </p>
                        <p className="mr-0.5">{activityItem.message}</p>
                        {isValid(activityItem.context) &&
                          JSON.parse(activityItem.context)["product_id"] &&
                          activityItem.log_level === "success" && (
                            <a
                              className="mr-0.5 text-xs mt-4 text-blue-600"
                              href={`/wp-admin/post.php?post=${
                                JSON.parse(activityItem.context)["product_id"]
                              }&action=edit`}
                              target="_blank"
                            >
                              View product
                            </a>
                          )}
                        {isValid(activityItem.context) &&
                          JSON.parse(activityItem.context)["error_message"] &&
                          activityItem.log_level === "error" && (
                            <p className="text-xs italic text-red-800">
                              {
                                JSON.parse(activityItem.context)[
                                  "error_message"
                                ]
                              }
                            </p>
                          )}
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SyncLog;
