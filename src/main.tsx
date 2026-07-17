import { ColorModeScript } from "@chakra-ui/react";
import "@fontsource/comfortaa/400.css";
import "@fontsource/comfortaa/700.css";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import theme from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>,
);
