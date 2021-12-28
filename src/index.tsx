import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
// import { BrowserRouter } from "react-router-dom";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "./BrowserRouter";
import reducers from "./reducers";
import history from "./history";
import "./index.css";
import App from "./App";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [""],
};

const persistedReducer = persistReducer(persistConfig, reducers);
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// create store with reducers and applyMiddleware(thunk) for axios async
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter history={history}>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
