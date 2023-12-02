import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // session storage
import inventoryReducer from "./inventorySlice";

const rootReducer = combineReducers({
  inventory: inventoryReducer,
  // Add other reducers here
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["inventory"], // only inventory will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
