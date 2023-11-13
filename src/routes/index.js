/**
 * Internal dependencies
 */
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";

const routes = [
  {
    path: "/",
    element: Dashboard,
  },
  {
    path: "/inventory",
    element: Inventory,
  },
];

export default routes;
