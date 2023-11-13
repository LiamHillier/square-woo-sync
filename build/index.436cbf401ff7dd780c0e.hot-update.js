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
      // 1699853998914
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
      className: "flex-grow text-slate-500 hover:text-primary border-b-2 hover:border-primary focus:border-primary py-6 px-4 sm:p-6 hover:bg-gray-liter max-w-[9rem] focus:outline-none focus:shadow-none ".concat(isActive('/') ? 'bg-gray-liter text-primary border-primary' : 'border-transparent')
    }, item.name, wp.element.createElement("span", {
      className: "sm:inline hidden float-left md:ml-3"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Home', 'jobplace')));
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

/***/ }),

/***/ "./src/hooks/useMenuFix.tsx":
/*!**********************************!*\
  !*** ./src/hooks/useMenuFix.tsx ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useMenuFix)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _utils_menuFix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/menuFix */ "./src/utils/menuFix.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "react-refresh/runtime");

/**
 * External dependencies
 */



/**
 * Internal dependencies
 */

function useMenuFix() {
  var location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useLocation)();

  /**
   * Call menuFix after any route changes.
   *
   * fix the admin menu for the slug
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    (0,_utils_menuFix__WEBPACK_IMPORTED_MODULE_1__.menuFix)();
  }, [location.pathname]);
  return null;
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

/***/ "./src/utils/menuFix.js":
/*!******************************!*\
  !*** ./src/utils/menuFix.js ***!
  \******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   menuFix: () => (/* binding */ menuFix),
/* harmony export */   wpReactKitSlug: () => (/* binding */ wpReactKitSlug)
/* harmony export */ });
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "react-refresh/runtime");

var wpReactKitSlug = 'square-woo-sync';

/**
 * As we are using hash based navigation, hack fix
 * to highlight the current selected menu
 *
 * Requires jQuery
 */
function menuFix() {
  var $ = jQuery;
  var menuRoot = $('#toplevel_page_' + wpReactKitSlug);
  var currentUrl = window.location.href;
  var currentPath = currentUrl.substr(currentUrl.indexOf('admin.php'));
  $('ul.wp-submenu li', menuRoot).removeClass('current');
  menuRoot.on('click', 'a', function () {
    var self = $(this);
    $('ul.wp-submenu li', menuRoot).removeClass('current');
    if (self.hasClass('wp-has-submenu')) {
      $('li.wp-first-item', menuRoot).addClass('current');
    } else {
      self.parents('li').addClass('current');
    }
  });
  var navRoutes = currentPath.split('/');
  $('ul.wp-submenu a', menuRoot).each(function (index, el) {
    var routeName = typeof navRoutes[1] !== "undefined" ? navRoutes[1] : ""; // eslint-disable-line
    var isActive = false;
    // const subRoute = typeof(routeName.split('?')[0] !== 'undefined') ? routeName.split('?')[0] : ""; // eslint-disable-line

    switch ($(el).attr('href')) {
      case currentPath:
        isActive = true;
        break;
      default:
        break;
    }
    if (isActive) {
      $(el).parent().addClass('current');
    }
  });
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

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("40e93b641bb068719002")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.436cbf401ff7dd780c0e.hot-update.js.map