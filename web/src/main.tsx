import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App";
import { SystemActionsProvider } from "./contexts/SystemActions";
import { I18nProvider } from "./i18n";
import { exposePluginSDK } from "./plugins";
import { ThemeProvider } from "./themes";
import { HERMES_BASE_PATH } from "./lib/api";

// The dashboard remains server-backed: the service worker intentionally does
// not cache HTML or API responses because index.html contains a short-lived
// session token. Registration provides the installable mobile app shell while
// every launch still authenticates against the live Hermes backend.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const root = `${HERMES_BASE_PATH || ""}/`;
    void navigator.serviceWorker.register(`${root}sw.js`, { scope: root });
  });
}

// Expose the plugin SDK before rendering so plugins loaded via <script>
// can access React, components, etc. immediately.
exposePluginSDK();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={HERMES_BASE_PATH || undefined}>
    <I18nProvider>
      <ThemeProvider>
        <SystemActionsProvider>
          <App />
        </SystemActionsProvider>
      </ThemeProvider>
    </I18nProvider>
  </BrowserRouter>,
);
