import React from "react";
import ReactDOM from "react-dom/client";
import "./pyggb.scss";
import App from "./App";
import { StoreProvider } from "easy-peasy";
import { store } from "./store";
import "./shared/appApi";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
