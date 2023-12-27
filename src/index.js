import router from "./router";
import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";;;

// 注入redux
import store from "./store";

// 注入路由
import { RouterProvider } from "react-router-dom";
// 主题颜色定制
import "./myCss.css";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
