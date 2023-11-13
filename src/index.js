/**
 * External dependencies
 */
import { createRoot } from "@wordpress/element";
/**
 * Internal dependencies
 */
import App from "./App.jsx";

// Import the stylesheet for the plugin.
import "./style/tailwind.css";
import "./style/main.scss";

const element = document.getElementById("square-woo-sync");
if (typeof element !== "undefined" && element !== null) {
  const root = createRoot(element);
  root.render(<App />);
}
