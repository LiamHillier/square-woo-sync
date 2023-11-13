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
      // 1699853922165
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
    return wp.element.createElement("a", {
      key: item.name,
      href: item.href,
      className: (0,_utils_classHelper__WEBPACK_IMPORTED_MODULE_1__.classNames)(item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white", "rounded-md px-3 py-2 text-sm font-medium"),
      "aria-current": item.current ? "page" : undefined
    }, item.name);
  }), wp.element.createElement("span", {
    className: "sm:inline hidden float-left md:ml-3"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Jobs", "square-woo-sync")));
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
/******/ 	__webpack_require__.h = () => ("73c1d6f69e8d7bc1f08f")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.620829864f936b793c23.hot-update.js.map