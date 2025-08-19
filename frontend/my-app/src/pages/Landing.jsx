import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  function handlePrimary() {
    if (token) navigate("/projects");
    else navigate("/auth", { state: { from: { pathname: "/projects" } } });
  }
  function handleSecondary() {
    navigate("/auth");
  }
  return (
    <div className="container">
      <div className="hero">
        <h1 className="hero-title">ProjectFlow</h1>
        <p className="subtitle">
          Plan, track, and deliver projects faster with a clean dashboard,
          kanban tasks, and Gemini AI assistance.
        </p>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn alt" onClick={handlePrimary}>
            {token ? "Go to Projects" : "Get Started"}
          </button>
          <button className="btn secondary" onClick={handleSecondary}>
            Explore Features
          </button>
        </div>
      </div>

      <div className="features">
        <div className="card feature-card pastel blue">
          <div className="feature-title">Authentication</div>
          <div className="feature-desc">Secure login and JWT-based access.</div>
        </div>
        <div className="card feature-card pastel sky">
          <div className="feature-title">Projects Dashboard</div>
          <div className="feature-desc">
            Track status, dates, and progress at a glance.
          </div>
        </div>
        <div className="card feature-card pastel violet">
          <div className="feature-title">Kanban Tasks</div>
          <div className="feature-desc">
            Organize tasks by status and move them across columns.
          </div>
        </div>
        <div className="card feature-card pastel rose">
          <div className="feature-title">AI Suggestions</div>
          <div className="feature-desc">
            Use Gemini to generate project and task ideas.
          </div>
        </div>
        <div className="card feature-card pastel amber">
          <div className="feature-title">Prisma + Postgres</div>
          <div className="feature-desc">
            Robust backend with migrations and relations.
          </div>
        </div>
        <div className="card feature-card pastel green">
          <div className="feature-title">Clean Light UI</div>
          <div className="feature-desc">
            Professional blue/violet hues and modern components.
          </div>
        </div>
      </div>
    </div>
  );
}
