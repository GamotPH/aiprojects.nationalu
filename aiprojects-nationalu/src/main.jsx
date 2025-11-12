// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";              
import People from "./components/People.jsx";
import PersonDetail from "./components/PersonDetail.jsx";
import ProjectDetails from "./components/ProjectDetails.jsx";
import PolicyPage from "./components/PolicyPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="people" element={<People />} />
        <Route path="people/:slug" element={<PersonDetail />} />
        <Route path="/projects/:slug/*" element={<ProjectDetails />} />
        <Route path="/projects/:slug/policy" element={<PolicyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
