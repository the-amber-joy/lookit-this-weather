import { ColorModeScript } from "@chakra-ui/react";
import "@fontsource/comfortaa/400.css";
import "@fontsource/comfortaa/700.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import App from "./App";
import "./index.css";
import theme from "./theme/theme";

// The browser's built-in service worker update check only runs roughly once
// every 24 hours per registration, so a PWA left open/reopened without a
// true reload can serve a stale cached build for a long time. Registering
// manually lets us poll for updates far more often; registerType
// "autoUpdate" (see vite.config.ts) then reloads the page automatically
// once a new service worker takes over.
const UPDATE_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    setInterval(() => {
      registration.update();
    }, UPDATE_CHECK_INTERVAL);
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>,
);
