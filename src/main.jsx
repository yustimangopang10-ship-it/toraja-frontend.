import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";           // ← GANTI JADI INI (bukan bootstrap-custom.css)
import 'bootstrap/dist/css/bootstrap.min.css';

// Konfigurasi FontAwesome secara global
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

// Global fetch hook to rewrite localhost:5000 to the hosted API URL
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === "string" && input.startsWith("http://localhost:5000")) {
    const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";
    input = input.replace("http://localhost:5000", API_URL);
  }
  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);