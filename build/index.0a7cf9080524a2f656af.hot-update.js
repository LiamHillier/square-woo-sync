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
      // 1699857269885
      var cssReload = __webpack_require__(/*! ../../node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js */ "./node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
    }
  

/***/ }),

/***/ "./src/components/layout/Header.jsx":
/*!******************************************!*\
  !*** ./src/components/layout/Header.jsx ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @headlessui/react */ "./node_modules/@headlessui/react/dist/components/disclosure/disclosure.js");
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @headlessui/react */ "./node_modules/@headlessui/react/dist/components/menu/menu.js");
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @headlessui/react */ "./node_modules/@headlessui/react/dist/components/transitions/transition.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/Bars3Icon.js");
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @heroicons/react/24/outline */ "./node_modules/@heroicons/react/24/outline/esm/BellIcon.js");
/* harmony import */ var _heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @heroicons/react/20/solid */ "./node_modules/@heroicons/react/20/solid/esm/PlusIcon.js");
/* harmony import */ var _navigation_Main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./navigation/Main */ "./src/components/layout/navigation/Main.jsx");
/* harmony import */ var _logo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../logo */ "./src/components/logo/index.js");
/* harmony import */ var _utils_classHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/classHelper */ "./src/utils/classHelper.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "react-refresh/runtime");








var user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};
var userNavigation = [{
  name: "Your Profile",
  href: "#"
}, {
  name: "Settings",
  href: "#"
}, {
  name: "Sign out",
  href: "#"
}];
var navigation = [{
  name: "Dashboard",
  href: "/",
  current: true
}, {
  name: "Inventory",
  href: "/inventory",
  current: false
}, {
  name: "Documentation",
  href: "/documentation",
  current: false
}, {
  name: "Settings",
  href: "/settings",
  current: false
}];
function Header() {
  return wp.element.createElement("header", {
    className: "fixed top-0 top-[32px] w-full"
  }, wp.element.createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_4__.Disclosure, {
    as: "nav",
    className: "bg-gray-800"
  }, function (_ref) {
    var open = _ref.open;
    return wp.element.createElement("div", {
      className: "max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 justify-between"
    }, wp.element.createElement("div", {
      className: "flex"
    }, wp.element.createElement("div", {
      className: "-ml-2 mr-2 flex items-center md:hidden"
    }, wp.element.createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_4__.Disclosure.Button, {
      className: "relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    }, wp.element.createElement("span", {
      className: "absolute -inset-0.5"
    }), wp.element.createElement("span", {
      className: "sr-only"
    }, "Open main menu"), open ? wp.element.createElement(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_5__["default"], {
      className: "block h-6 w-6",
      "aria-hidden": "true"
    }) : wp.element.createElement(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_6__["default"], {
      className: "block h-6 w-6",
      "aria-hidden": "true"
    }))), wp.element.createElement("div", {
      className: "flex flex-shrink-0 items-center"
    }, wp.element.createElement(_logo__WEBPACK_IMPORTED_MODULE_2__["default"], null)), wp.element.createElement(_navigation_Main__WEBPACK_IMPORTED_MODULE_1__["default"], {
      navItems: navigation
    })), wp.element.createElement("div", {
      className: "flex items-center"
    }, wp.element.createElement("div", {
      className: "flex-shrink-0"
    }, wp.element.createElement("button", {
      type: "button",
      className: "relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    }, wp.element.createElement(_heroicons_react_20_solid__WEBPACK_IMPORTED_MODULE_7__["default"], {
      className: "-ml-0.5 h-5 w-5",
      "aria-hidden": "true"
    }), "New Job")), wp.element.createElement("div", {
      className: "hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center"
    }, wp.element.createElement("button", {
      type: "button",
      className: "relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    }, wp.element.createElement("span", {
      className: "absolute -inset-1.5"
    }), wp.element.createElement("span", {
      className: "sr-only"
    }, "View notifications"), wp.element.createElement(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_8__["default"], {
      className: "h-6 w-6",
      "aria-hidden": "true"
    })), wp.element.createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Menu, {
      as: "div",
      className: "relative ml-3"
    }, wp.element.createElement("div", null, wp.element.createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Menu.Button, {
      className: "relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    }, wp.element.createElement("span", {
      className: "absolute -inset-1.5"
    }), wp.element.createElement("span", {
      className: "sr-only"
    }, "Open user menu"), wp.element.createElement("img", {
      className: "h-8 w-8 rounded-full",
      src: user.imageUrl,
      alt: ""
    }))), wp.element.createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_10__.Transition, {
      as: _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment,
      enter: "transition ease-out duration-200",
      enterFrom: "transform opacity-0 scale-95",
      enterTo: "transform opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "transform opacity-100 scale-100",
      leaveTo: "transform opacity-0 scale-95"
    }, wp.element.createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Menu.Items, {
      className: "absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    }, userNavigation.map(function (item) {
      return wp.element.createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Menu.Item, {
        key: item.name
      }, function (_ref2) {
        var active = _ref2.active;
        return wp.element.createElement("a", {
          href: item.href,
          className: (0,_utils_classHelper__WEBPACK_IMPORTED_MODULE_3__.classNames)(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")
        }, item.name);
      });
    })))))));
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
/******/ 	__webpack_require__.h = () => ("c6e956f01fd49a9193a3")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.0a7cf9080524a2f656af.hot-update.js.map