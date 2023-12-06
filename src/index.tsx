import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./REDUX/bigpie";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LayoutComponents from "./layout/layoutComponents";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <LayoutComponents>
      <BrowserRouter basename="Whatsgram">
        <App />
      </BrowserRouter>
    </LayoutComponents>
  </Provider>
);
// <React.StrictMode>
{
  /* </React.StrictMode> */
}
