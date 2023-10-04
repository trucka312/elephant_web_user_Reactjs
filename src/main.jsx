import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/index.css";
import { ConfigProvider } from 'antd';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#20409a",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
