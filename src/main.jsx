// import { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter as Router } from "react-router-dom";  // ✅ add this
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
      <Router>       {/* ✅ wrap App with Router */}
        <App />
      </Router>
  </Provider>
);
