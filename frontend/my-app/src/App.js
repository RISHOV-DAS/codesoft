import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

function Shell({ children }) {
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
            <NavLink to="/auth">Auth</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
          </nav>
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
