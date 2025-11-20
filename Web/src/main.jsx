import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ← Import Router
import App from "./App.jsx";
import "./index.css";
import { 
  configureCloudSync, 
  syncUsersToStorage, 
  startOrderPolling 
} from "@shared/services/cloudSyncService";

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
  || 'http://localhost:3000';

configureCloudSync({
  baseUrl: API_BASE_URL,
  orderPollIntervalMs: Number(import.meta.env?.VITE_ORDER_POLL_MS) || 5000,
});

if (typeof window !== 'undefined' && window.localStorage) {
  syncUsersToStorage(window.localStorage).catch((error) =>
    console.error('Initial user sync failed:', error)
  );
  startOrderPolling(window.localStorage);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* ← Router CHỈ Ở ĐÂY */}
      <App />
    </BrowserRouter>
  </StrictMode>
);