import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import App from "./App.jsx";
import "./index.css";

// Suppress known browser-extension errors (e.g. tabs.get invalid tabId) so they don't show in production
window.addEventListener("unhandledrejection", (event) => {
  const msg = event.reason?.message ?? String(event.reason ?? "");
  if (
    typeof msg === "string" &&
    (msg.includes("tabs.get") || msg.includes("tabId") || msg.includes("Value must be at least 0"))
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
      <ToastProvider>
        <Router>
          <App />
        </Router>
      </ToastProvider>
  </Provider>
);
