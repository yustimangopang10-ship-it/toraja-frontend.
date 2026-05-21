import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// Konfigurasi FontAwesome secara global
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

// Global fetch hook: gunakan VITE_API_URL dari .env
// Lokal  → VITE_API_URL=http://localhost:5000  (dari .env)
// Produksi → VITE_API_URL=https://toraja-backend.vercel.app (dari Vercel env vars)
const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === "string" && input.startsWith("http://localhost:5000")) {
    input = input.replace("http://localhost:5000", API_URL);
  }
  return originalFetch(input, init);
};

// Hapus StrictMode agar efek tidak dipanggil 2x di development (penyebab flash/hilang)
ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);