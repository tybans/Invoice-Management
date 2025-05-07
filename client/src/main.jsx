import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { InvoiceProvider } from "./context/InvoiceContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <InvoiceProvider>
      <App />
    </InvoiceProvider>
  </React.StrictMode>
);
