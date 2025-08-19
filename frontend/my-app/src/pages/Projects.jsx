import React, { useEffect, useState } from "react";
import { getProjectsForUser, createProject } from "../services/api";
import { useGeminiIdeas } from "../services/gemini";

export default function Projects() {
  const [userId] = useState("demo-user");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { generateProjectIdeas, ideas, thinking } = useGeminiIdeas();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await getProjectsForUser(userId);
        setProjects(res?.projects || []);
      } catch (e) {
        setError(e.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  async function addProject() {
    const payload = {
      userId,
      projectData: { title, description, status: "todo" },
    };
    try {
      const created = await createProject(payload);
      if (created?.project) {
        setProjects([created.project, ...projects]);
        setTitle("");
        setDescription("");
      }
    } catch (e) {
      setError(e.message || "Failed to create project");
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ marginBottom: 12 }}>
        <h2 className="grow" style={{ margin: 0 }}>
          Projects
        </h2>
        <button
          className="btn secondary"
          onClick={() => generateProjectIdeas()}
        >
          Generate with AI
        </button>
      </div>

      {thinking && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          Thinking with Gemini...
        </div>
      )}
      {error && (
        <div className="card" style={{ padding: 12, marginBottom: 12, color: '#991b1b', background:'#fff0f0', border:'1px solid #fecaca' }}>
          {error}
        </div>
      )}
      {ideas.length > 0 && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>AI Suggestions</div>
          <div className="row">
            {ideas.map((i, idx) => (
              <button
                key={idx}
                className="btn ghost"
                onClick={() => setTitle(i.title)}
              >
                {i.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="row">
          <input
            className="input grow"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn" onClick={addProject}>
            New Project
          </button>
        </div>
        <textarea
          className="textarea"
          placeholder="Description (optional)"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--ring)",
                }}
              >
                Project Name
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--ring)",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--ring)",
                }}
              >
                Start Date
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--ring)",
                }}
              >
                End Date
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={{ padding: 16 }} colSpan="4">
                  Loading...
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid var(--ring)",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ color: "var(--muted)" }}>{p.description}</div>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid var(--ring)",
                    }}
                  >
                    {p.status}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid var(--ring)",
                    }}
                  >
                    {p.startDate
                      ? new Date(p.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid var(--ring)",
                    }}
                  >
                    {p.endDate ? new Date(p.endDate).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
