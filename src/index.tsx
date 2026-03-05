import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // 這一行一定要有，才能把樣式帶進去
import App from "./App";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
