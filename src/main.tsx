import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SiteSettingsProvider>
      <App />
    </SiteSettingsProvider>
  </React.StrictMode>
);