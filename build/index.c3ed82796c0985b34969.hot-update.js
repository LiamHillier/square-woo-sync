"use strict";
globalThis["webpackHotUpdatesquare_woo_sync"]("index",{

/***/ "./src/style/tailwind.css":
/*!********************************!*\
  !*** ./src/style/tailwind.css ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

    if(true) {
      // 1699858678966
      var cssReload = __webpack_require__(/*! ../../node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js */ "./node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
    }
  

/***/ }),

/***/ "./src/components/inventory/Actions.jsx":
/*!**********************************************!*\
  !*** ./src/components/inventory/Actions.jsx ***!
  \**********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Actions)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ClockIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/CheckBadgeIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/BanknotesIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ReceiptRefundIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "react-refresh/runtime");


var actions = [{
  title: "Sin",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_0__["default"],
  iconForeground: "text-teal-700",
  iconBackground: "bg-teal-50"
}, {
  title: "Benefits",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__["default"],
  iconForeground: "text-purple-700",
  iconBackground: "bg-purple-50"
}, {
  title: "Schedule a one-on-one",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"],
  iconForeground: "text-sky-700",
  iconBackground: "bg-sky-50"
}, {
  title: "Payroll",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"],
  iconForeground: "text-yellow-700",
  iconBackground: "bg-yellow-50"
}, {
  title: "Submit an expense",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__["default"],
  iconForeground: "text-rose-700",
  iconBackground: "bg-rose-50"
}, {
  title: "Training",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_5__["default"],
  iconForeground: "text-indigo-700",
  iconBackground: "bg-indigo-50"
}];
function classNames() {
  for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }
  return classes.filter(Boolean).join(" ");
}
function Actions() {
  return wp.element.createElement("div", {
    className: "divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow-xl sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0"
  }, actions.map(function (action, actionIdx) {
    return wp.element.createElement("div", {
      key: action.title,
      className: classNames(actionIdx === 0 ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none" : "", actionIdx === 1 ? "sm:rounded-tr-lg" : "", actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "", actionIdx === actions.length - 1 ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none" : "", "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500")
    }, wp.element.createElement("div", null, wp.element.createElement("span", {
      className: classNames(action.iconBackground, action.iconForeground, "inline-flex rounded-lg p-3 ring-4 ring-white")
    }, wp.element.createElement(action.icon, {
      className: "h-6 w-6",
      "aria-hidden": "true"
    }))), wp.element.createElement("div", {
      className: "mt-8"
    }, wp.element.createElement("h3", {
      className: "text-base font-semibold leading-6 text-gray-900"
    }, wp.element.createElement("a", {
      href: action.href,
      className: "focus:outline-none"
    }, wp.element.createElement("span", {
      className: "absolute inset-0",
      "aria-hidden": "true"
    }), action.title)), wp.element.createElement("p", {
      className: "mt-2 text-sm text-gray-500"
    }, "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.")), wp.element.createElement("span", {
      className: "pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400",
      "aria-hidden": "true"
    }, wp.element.createElement("svg", {
      className: "h-6 w-6",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, wp.element.createElement("path", {
      d: "M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
    }))));
  }));
}

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		let errorOverlay;
		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
			errorOverlay = __react_refresh_error_overlay__;
		}
		let testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("28c38e15ac5ec4bc8cd2")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.c3ed82796c0985b34969.hot-update.js.map