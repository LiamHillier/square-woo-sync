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
      // 1699858377410
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
  title: "Request time off",
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
    className: "divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0"
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

/***/ }),

/***/ "./src/pages/Inventory.jsx":
/*!*********************************!*\
  !*** ./src/pages/Inventory.jsx ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Inventory)
/* harmony export */ });
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ArrowSmallRightIcon.js");
/* harmony import */ var _utils_classHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/classHelper */ "./src/utils/classHelper.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/ArrowsUpDownIcon.js");
/* harmony import */ var _components_inventory_Actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/inventory/Actions */ "./src/components/inventory/Actions.jsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "react-refresh/runtime");





var statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10"
};
var activityItems = [{
  user: {
    name: "Michael Foster",
    imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "2d89f0c8",
  branch: "main",
  status: "Completed",
  duration: "25s",
  date: "45 minutes ago",
  dateTime: "2023-01-23T11:00"
}, {
  user: {
    name: "Lindsay Walton",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "249df660",
  branch: "main",
  status: "Completed",
  duration: "1m 32s",
  date: "3 hours ago",
  dateTime: "2023-01-23T09:00"
}, {
  user: {
    name: "Courtney Henry",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "11464223",
  branch: "main",
  status: "Error",
  duration: "1m 4s",
  date: "12 hours ago",
  dateTime: "2023-01-23T00:00"
}, {
  user: {
    name: "Courtney Henry",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "dad28e95",
  branch: "main",
  status: "Completed",
  duration: "2m 15s",
  date: "2 days ago",
  dateTime: "2023-01-21T13:00"
}, {
  user: {
    name: "Michael Foster",
    imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "624bc94c",
  branch: "main",
  status: "Completed",
  duration: "1m 12s",
  date: "5 days ago",
  dateTime: "2023-01-18T12:34"
}, {
  user: {
    name: "Courtney Henry",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "e111f80e",
  branch: "main",
  status: "Completed",
  duration: "1m 56s",
  date: "1 week ago",
  dateTime: "2023-01-16T15:54"
}, {
  user: {
    name: "Michael Foster",
    imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "5e136005",
  branch: "main",
  status: "Completed",
  duration: "3m 45s",
  date: "1 week ago",
  dateTime: "2023-01-16T11:31"
}, {
  user: {
    name: "Whitney Francis",
    imageUrl: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  commit: "5c1fd07f",
  branch: "main",
  status: "Completed",
  duration: "37s",
  date: "2 weeks ago",
  dateTime: "2023-01-09T08:45"
}];
function Inventory() {
  return wp.element.createElement(React.Fragment, null, wp.element.createElement(_components_inventory_Actions__WEBPACK_IMPORTED_MODULE_1__["default"], null), wp.element.createElement("div", {
    className: "bg-white rounded-2xl shadow-xl overflow-hidden"
  }, wp.element.createElement("div", {
    className: "px-4 py-5 sm:px-6"
  }, wp.element.createElement("div", {
    className: "flex flex-wrap items-center justify-between sm:flex-nowrap"
  }, wp.element.createElement("h2", {
    className: "text-base font-semibold leading-7 text-gray-900 "
  }, "Sync log"), wp.element.createElement("div", {
    className: "ml-4 flex flex-shrink-0"
  }, wp.element.createElement("button", {
    type: "button",
    className: "relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
  }, wp.element.createElement(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "-ml-0.5 mr-1.5 h-5 w-5 text-white",
    "aria-hidden": "true"
  }), wp.element.createElement("span", null, "Sync"))))), wp.element.createElement("div", {
    className: "overflow-x-auto"
  }, wp.element.createElement("table", {
    className: "whitespace-nowrap text-left bg-white"
  }, wp.element.createElement("colgroup", null, wp.element.createElement("col", {
    className: "w-full lg:w-1/12"
  }), wp.element.createElement("col", {
    className: "w-full sm:w-4/12"
  }), wp.element.createElement("col", {
    className: "w-full lg:w-2/12"
  }), wp.element.createElement("col", {
    className: "w-full lg:w-1/12"
  }), wp.element.createElement("col", {
    className: "w-full lg:w-1/12"
  })), wp.element.createElement("thead", {
    className: "border-b border-gray-900/10 text-sm leading-6 text-gray-900"
  }, wp.element.createElement("tr", null, wp.element.createElement("th", {
    scope: "col",
    className: "py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
  }, "SKU"), wp.element.createElement("th", {
    scope: "col",
    className: "py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
  }, "Product Name"), wp.element.createElement("th", {
    scope: "col",
    className: "hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
  }, "Sync Direction"), wp.element.createElement("th", {
    scope: "col",
    className: "py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
  }, "Status"), wp.element.createElement("th", {
    scope: "col",
    className: "hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
  }, "Created at"))), wp.element.createElement("tbody", {
    className: "divide-y divide-gray-200"
  }, activityItems.map(function (item) {
    return wp.element.createElement("tr", {
      key: item.commit,
      className: ""
    }, wp.element.createElement("td", {
      className: "py-4 pl-4 pr-8 sm:pl-6 lg:pl-8"
    }, "asdasd"), wp.element.createElement("td", {
      className: "py-4 pl-4 pr-8 sm:pl-6 lg:pl-8"
    }, wp.element.createElement("div", {
      className: "flex items-center gap-x-4"
    }, wp.element.createElement("img", {
      src: item.user.imageUrl,
      alt: "",
      className: "h-8 w-8 rounded-full bg-gray-800"
    }), wp.element.createElement("div", {
      className: "truncate text-sm font-medium leading-6 text-gray-900"
    }, item.user.name))), wp.element.createElement("td", {
      className: "hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8"
    }, wp.element.createElement("div", {
      className: "flex gap-2 items-center"
    }, wp.element.createElement("div", {
      className: "font-mono text-xs leading-6 text-white bg-black px-4 rounded-full"
    }, "square"), wp.element.createElement(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__["default"], {
      className: "w-4 h-4"
    }), wp.element.createElement("div", {
      className: "font-mono text-xs leading-6 text-white bg-purple-500 px-4 rounded-full"
    }, "woo"))), wp.element.createElement("td", {
      className: "py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20"
    }, wp.element.createElement("div", {
      className: "flex items-center justify-end gap-x-2 sm:justify-start"
    }, wp.element.createElement("time", {
      className: "text-gray-400 sm:hidden",
      dateTime: item.dateTime
    }, item.date), wp.element.createElement("div", {
      className: (0,_utils_classHelper__WEBPACK_IMPORTED_MODULE_0__.classNames)(statuses[item.status], "flex-none rounded-full p-1")
    }, wp.element.createElement("div", {
      className: "h-1.5 w-1.5 rounded-full bg-current"
    })), wp.element.createElement("div", {
      className: "hidden text-gray-900 sm:block"
    }, item.status))), wp.element.createElement("td", {
      className: "hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8"
    }, wp.element.createElement("time", {
      dateTime: item.dateTime
    }, item.date)));
  }))))));
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

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function AcademicCapIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
  }));
}
const ForwardRef = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(AcademicCapIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/BanknotesIcon.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/BanknotesIcon.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function BanknotesIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
  }));
}
const ForwardRef = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(BanknotesIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/CheckBadgeIcon.js":
/*!************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/CheckBadgeIcon.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function CheckBadgeIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
  }));
}
const ForwardRef = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(CheckBadgeIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/ClockIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/ClockIcon.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ClockIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
  }));
}
const ForwardRef = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ClockIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/ReceiptRefundIcon.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/ReceiptRefundIcon.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function ReceiptRefundIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"
  }));
}
const ForwardRef = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(ReceiptRefundIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/UsersIcon.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function UsersIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
  }));
}
const ForwardRef = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(UsersIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("496ee9f51512717d2fff")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.c536dd292efc967aa407.hot-update.js.map