/**
 * External dependencies
 */
import { Link, useLocation } from "react-router-dom";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { classNames } from "../../../utils/classHelper";
import useMenuFix from "../../../hooks/useMenuFix";

function Main({ navItems }) {
  const location = useLocation();

  useMenuFix();

  const navRoutes = location.pathname.split("/");

  const isActive = (path) => {
    const routeName = typeof navRoutes[1] !== "undefined" ? navRoutes[1] : path;

    if ("/" + routeName === path) {
      return true;
    }

    return false;
  };

  return (
    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`${
            isActive(item.href)
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } rounded-md px-3 py-2 text-sm font-medium focus:text-white`}
        >
          {item.name}
          <span className="hidden">{__(item.name, "square-woo-sync")}</span>
        </Link>
      ))}
    </div>
  );
}

export default Main;
