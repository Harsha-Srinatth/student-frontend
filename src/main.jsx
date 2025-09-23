// import { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter as Router } from "react-router-dom";  // ✅ add this
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
      <Router>       {/* ✅ wrap App with Router */}
        <App />
      </Router>
  </Provider>
);
