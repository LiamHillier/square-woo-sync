import { useEffect, useState } from "@wordpress/element";
import { Dialog, Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import apiFetch from "@wordpress/api-fetch";
import { Bars3Icon } from "@heroicons/react/20/solid";
import {
  BellIcon,
  Cog8ToothIcon,
  CreditCardIcon,
  CubeIcon,
  FingerPrintIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "../../utils/classHelper";
import { Link } from "react-router-dom";
import AccessToken from "../../components/features/settings/general/AccessToken";
import Webhook from "../../components/features/settings/general/Webhook";
import SKUSuffix from "../../components/features/settings/general/SKUSuffix";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Invoices", href: "#" },
  { name: "Clients", href: "#" },
  { name: "Expenses", href: "#" },
];
const secondaryNavigation = [
  {
    name: "General",
    href: "/settings/general",
    icon: Cog8ToothIcon,
    current: true,
  },
  //   { name: "Security", href: "#", icon: FingerPrintIcon, current: false },
  //   { name: "Notifications", href: "#", icon: BellIcon, current: false },
  //   { name: "Plan", href: "#", icon: CubeIcon, current: false },
  //   { name: "Billing", href: "#", icon: CreditCardIcon, current: false },
  //   { name: "Team members", href: "#", icon: UsersIcon, current: false },
];

export default function Settings() {
  const [settings, setSettings] = useState({ woo_suffix: "sws" });

  useEffect(() => {
    const getSettings = async () => {
      apiFetch({ path: "/sws/v1/settings", method: "GET" })
        .then((res) => {
          setSettings(res);
        })
        .catch((err) => {
          toast({
            render: "Failed to update settings: " + err.message,
            type: "error",
            isLoading: false,
            autoClose: false,
            closeOnClick: true,
          });
        });
    };
    getSettings();
  }, []);

  const updateSettings = async (key, val) => {
    console.log(key, val);
    const id = toast.loading(`Updating setting: ${key} to ${val}`);
    try {
      const result = await apiFetch({
        path: "/sws/v1/settings", // Updated path
        method: "POST",
        data: { [key]: val },
      });
      if (result) {
        toast.update(id, {
          render: "settings updated successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }
      console.log(result);
    } catch (err) {
      toast.update(id, {
        render: "Failed to update settings: " + err.message,
        type: "error",
        isLoading: false,
        autoClose: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <div className="lg:flex lg:gap-x-16 bg-white rounded-2xl shadow-lg p-6">
        <aside className="flex border-b border-gray-900/5 lg:block lg:w-64 lg:flex-none lg:border-0 ">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul
              role="list"
              className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                      "group flex gap-x-3 rounded-lg py-2 pl-2 pr-3 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
          <AccessToken />
          <SKUSuffix
            title="Are you sure you want to change the Woo SKU suffix?"
            description="Changing the Woo SKU suffix will require you to delete and re-import all the products you wish to be synced with Square"
            suffix={settings.woo_suffix}
            setSuffix={(val) => setSettings({ ...settings, woo_suffix: val })}
            onConfirm={() => updateSettings("woo_suffix", settings.woo_suffix)}
          />
          <Webhook />
          <div className="px-4 pt-5 sm:px-6"></div>
          <div className="px-4 pb-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Automatic Syncing
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 mb-4">
              <p>
                Enable or disable automatic inventory syncing between
                WooCommerce and Square effortlessly with our Inventory Sync
                Toggle. Streamline your product management with ease.
                <br></br>
                <a href="#" className="underline text-indigo-500">
                  How to setup and control automatic syncing between Square and
                  Woocommerce
                </a>
              </p>
            </div>
            <div className="mb-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  disabled
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-400 dark:text-gray-500">
                  Square to woo (Webhook must be setup)
                </span>
              </label>
              <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg sm:flex my-3">
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                  <div class="flex items-center ps-3">
                    <input
                      id="vue-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="vue-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Stock
                    </label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div class="flex items-center ps-3">
                    <input
                      id="react-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="react-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Title
                    </label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div class="flex items-center ps-3">
                    <input
                      id="angular-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="angular-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Description
                    </label>
                  </div>
                </li>
                <li class="w-full ">
                  <div class="flex items-center ps-3">
                    <input
                      id="laravel-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="laravel-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Images
                    </label>
                  </div>
                </li>
                <li class="w-full ">
                  <div class="flex items-center ps-3">
                    <input
                      id="laravel-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="laravel-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Category
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Woo to Square
                </span>
              </label>
              <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg sm:flex my-3">
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                  <div class="flex items-center ps-3">
                    <input
                      id="vue-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="vue-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Stock
                    </label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div class="flex items-center ps-3">
                    <input
                      id="react-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="react-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Title
                    </label>
                  </div>
                </li>
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div class="flex items-center ps-3">
                    <input
                      id="angular-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="angular-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Description
                    </label>
                  </div>
                </li>
                <li class="w-full ">
                  <div class="flex items-center ps-3">
                    <input
                      id="laravel-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="laravel-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Images
                    </label>
                  </div>
                </li>
                <li class="w-full ">
                  <div class="flex items-center ps-3">
                    <input
                      id="laravel-checkbox-list"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="laravel-checkbox-list"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Category
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
