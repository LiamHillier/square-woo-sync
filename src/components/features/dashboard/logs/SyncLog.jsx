import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { classNames } from "../../../../utils/classHelper";

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

  return (
    <div className="bg-white shadow rounded-xl mt-10 p-6">
      <h2 className="text-lg font-semibold mb-4">Sync Log</h2>
      <ul className="divide-y text-gray-500 rounded-xl p-2 divide-gray-300 border border-gray-300">
        {logs.map((log) => {
          return (
            <li key={log.id} className="flex gap-4 p-2 items-center mb-0">
              <span className="col-span-2 text-teal-700">{log.timestamp}</span>
              <span
                className={classNames("col-span-1", levelColor(log.log_level))}
              >
                {log.log_level}
              </span>
              <span className="col-span-9 lowercase">{log.message}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SyncLog;
