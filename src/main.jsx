import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";           // ← GANTI JADI INI (bukan bootstrap-custom.css)
import 'bootstrap/dist/css/bootstrap.min.css';

// Global fetch hook to rewrite localhost:5000 to the hosted API URL
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === "string" && input.startsWith("http://localhost:5000")) {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    input = input.replace("http://localhost:5000", API_URL);
  }
  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);