import { Fragment } from "@wordpress/element";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import Main from "./navigation/Main";
import Logo from "../logo";
import { classNames } from "../../utils/classHelper";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Inventory", href: "/inventory", current: false },
  { name: "Documentation", href: "/documentation", current: false },
  { name: "Settings", href: "/settings/general", current: false },
];

export default function Header() {
  return (
    <header className="fixed top-0 top-[32px] bg-gray-800 plugin-nav">
      <Disclosure as="nav" className="w-full max-w-7xl mx-auto justify-between">
        {({ open }) => (
          <div className=" mx-auto px-4 sm:px-4 flex h-16 justify-between ">
            <div className="flex">
              <div className="-ml-2 mr-2 flex items-center md:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-shrink-0 items-center">
                <Logo />
              </div>
              <Main navItems={navigation} />
            </div>
          </div>
        )}
      </Disclosure>
    </header>
  );
}
