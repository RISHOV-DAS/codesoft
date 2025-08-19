import React from "react";

export default function Landing() {
  return (
    <div className="container">
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ margin: 0 }}>Gemini Project Manager</h2>
        <p style={{ color: "var(--muted)" }}>
          Light, professional project dashboard with AI assistance.
        </p>

        <div className="kpi">
          <div className="card tile">
            <div className="num">1</div>
            <div className="label">Not Started</div>
          </div>
          <div className="card tile">
            <div className="num">1</div>
            <div className="label">In Progress</div>
          </div>
          <div className="card tile">
            <div className="num">1</div>
            <div className="label">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
