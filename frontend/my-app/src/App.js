import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Shell({ children }) {
  const { token } = useAuth();
  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="inner">
          <div className="brand">ProjectFlow</div>
          <div className="spacer" />
          <nav className="nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            {!token && <NavLink to="/auth">Auth</NavLink>}
            {token && <NavLink to="/projects">Projects</NavLink>}
            {token && <NavLink to="/tasks">Tasks</NavLink>}
          </nav>
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AuthProvider>
  );
}
