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
      // 1699858766150
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
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/HandRaisedIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/ReceiptRefundIcon.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "react-refresh/runtime");


var actions = [{
  title: "Sync Square to Woo",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_0__["default"],
  iconForeground: "text-teal-700",
  iconBackground: "bg-teal-50"
}, {
  title: "Sync Woo to Square",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__["default"],
  iconForeground: "text-purple-700",
  iconBackground: "bg-purple-50"
}, {
  title: "Documentation",
  href: "#",
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"],
  iconForeground: "text-sky-700",
  iconBackground: "bg-sky-50"
}, {
  title: "Request help",
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
  icon: _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__["default"],
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

/***/ }),

/***/ "./node_modules/@heroicons/react/24/outline/esm/HandRaisedIcon.js":
/*!************************************************************************!*\
  !*** ./node_modules/@heroicons/react/24/outline/esm/HandRaisedIcon.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

function HandRaisedIcon({
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
    d: "M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
  }));
}
const ForwardRef = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(HandRaisedIcon);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForwardRef);

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("59aff576c79dc6fa0b7b")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.cb5786afb482bef040d9.hot-update.js.map