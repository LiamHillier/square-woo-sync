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
      // 1699854060340
      var cssReload = __webpack_require__(/*! ../../node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js */ "./node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
    }
  

/***/ }),

/***/ "./src/components/layout/navigation/Main.jsx":
/*!***************************************************!*\
  !*** ./src/components/layout/navigation/Main.jsx ***!
  \***************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_classHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/classHelper */ "./src/utils/classHelper.js");
/* harmony import */ var _hooks_useMenuFix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hooks/useMenuFix */ "./src/hooks/useMenuFix.tsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "react-refresh/runtime");

/**
 * External dependencies
 */



/**
 * Internal dependencies
 */


function Main(_ref) {
  var navItems = _ref.navItems;
  var location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  (0,_hooks_useMenuFix__WEBPACK_IMPORTED_MODULE_2__["default"])();
  var navRoutes = location.pathname.split("/");
  var isActive = function isActive(path) {
    var routeName = typeof navRoutes[1] !== "undefined" ? navRoutes[1] : path;
    if ("/" + routeName === path) {
      return true;
    }
    return false;
  };
  return wp.element.createElement("div", {
    className: "hidden md:ml-6 md:flex md:items-center md:space-x-4"
  }, navItems.map(function (item) {
    return wp.element.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__.Link, {
      key: item.name,
      to: item.href,
      className: "flex-grow text-slate-500 hover:text-primary border-b-2 hover:border-primary focus:border-primary py-6 px-4 sm:p-6 hover:bg-gray-liter max-w-[9rem] focus:outline-none focus:shadow-none ".concat(isActive("/") ? "bg-gray-liter text-primary border-primary" : "border-transparent")
    }, item.name, wp.element.createElement("span", {
      className: "hidden"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(item.name, "square-woo-sync")));
  }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Main);

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
/******/ 	__webpack_require__.h = () => ("bd330677b9af004f4589")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.016ece81d90baaaf0997.hot-update.js.map