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
      // 1699855439280
      var cssReload = __webpack_require__(/*! ../../node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js */ "./node_modules/@wordpress/scripts/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
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
/* harmony import */ var _utils_classHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/classHelper */ "./src/utils/classHelper.js");
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
  return wp.element.createElement("div", {
    className: "py-10"
  }, wp.element.createElement("h2", {
    className: "px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8"
  }, "Latest activity"), wp.element.createElement("table", {
    className: "mt-6 w-full whitespace-nowrap text-left"
  }, wp.element.createElement("colgroup", null, wp.element.createElement("col", {
    className: "w-full sm:w-4/12"
  }), wp.element.createElement("col", {
    className: "lg:w-4/12"
  }), wp.element.createElement("col", {
    className: "lg:w-2/12"
  }), wp.element.createElement("col", {
    className: "lg:w-1/12"
  }), wp.element.createElement("col", {
    className: "lg:w-1/12"
  })), wp.element.createElement("thead", {
    className: "border-b border-gray-900/10 text-sm leading-6 text-gray-900"
  }, wp.element.createElement("tr", null, wp.element.createElement("th", {
    scope: "col",
    className: "py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
  }, "User"), wp.element.createElement("th", {
    scope: "col",
    className: "hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
  }, "Commit"), wp.element.createElement("th", {
    scope: "col",
    className: "py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
  }, "Status"), wp.element.createElement("th", {
    scope: "col",
    className: "hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
  }, "Duration"), wp.element.createElement("th", {
    scope: "col",
    className: "hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
  }, "Deployed at"))), wp.element.createElement("tbody", {
    className: "divide-y divide-white/5"
  }, activityItems.map(function (item) {
    return wp.element.createElement("tr", {
      key: item.commit
    }, wp.element.createElement("td", {
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
      className: "flex gap-x-3"
    }, wp.element.createElement("div", {
      className: "font-mono text-sm leading-6 text-gray-400"
    }, item.commit), wp.element.createElement("div", {
      className: "rounded-md bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-white/10"
    }, item.branch))), wp.element.createElement("td", {
      className: "py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20"
    }, wp.element.createElement("div", {
      className: "flex items-center justify-end gap-x-2 sm:justify-start"
    }, wp.element.createElement("time", {
      className: "text-gray-400 sm:hidden",
      dateTime: item.dateTime
    }, item.date), wp.element.createElement("div", {
      className: (0,_utils_classHelper__WEBPACK_IMPORTED_MODULE_0__.classNames)(statuses[item.status], "flex-none rounded-full p-1 bg-")
    }, wp.element.createElement("div", {
      className: "h-1.5 w-1.5 rounded-full bg-current"
    })), wp.element.createElement("div", {
      className: "hidden text-gray-900 sm:block"
    }, item.status))), wp.element.createElement("td", {
      className: "hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20"
    }, item.duration), wp.element.createElement("td", {
      className: "hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8"
    }, wp.element.createElement("time", {
      dateTime: item.dateTime
    }, item.date)));
  }))));
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
/******/ 	__webpack_require__.h = () => ("7e56ee6942efcd733485")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.51fad7708aa2b6fe18e0.hot-update.js.map