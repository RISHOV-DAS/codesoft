import React, { useEffect, useMemo, useState } from "react";
import {
  getTasksForProject,
  createTask,
  updateTaskStatus,
} from "../services/api";
import { useGeminiIdeas } from "../services/gemini";

const COLUMNS = [
  { key: "todo", title: "To Do" },
  { key: "inprogress", title: "In Progress" },
  { key: "completed", title: "Done" },
];

export default function Tasks() {
  const [userId] = useState("demo-user");
  const [projectId] = useState("1");
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("");
  const { generateTaskIdeas, ideas, thinking } = useGeminiIdeas();

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await getTasksForProject(userId, projectId);
        setTasks(res || []);
      } catch (e) {
        setError(e.message || "Failed to load tasks");
      }
    }
    load();
  }, [userId, projectId]);

  async function addTask() {
    const payload = {
      userID: userId,
      projectID: projectId,
      taskData: { content, assignedTo: assignee, status: "todo" },
    };
    try {
      const t = await createTask(payload);
      if (t?.id || t?.task || t) {
        // backend README shows array/object; be resilient
        const newTask = t.task || t;
        setTasks([newTask, ...tasks]);
        setContent("");
        setAssignee("");
      }
    } catch (e) {
      setError(e.message || "Failed to add task");
    }
  }

  const grouped = useMemo(() => {
    const map = { todo: [], inprogress: [], completed: [] };
    tasks.forEach((t) => {
      (map[t.status] || map.todo).push(t);
    });
    return map;
  }, [tasks]);

  async function move(task, status) {
    try {
      await updateTaskStatus(userId, projectId, task.id, status);
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status } : t)));
    } catch (e) {
      setError(e.message || "Failed to move task");
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ marginBottom: 12 }}>
        <h2 className="grow" style={{ margin: 0 }}>
          Kanban Board
        </h2>
        <button className="btn secondary" onClick={() => generateTaskIdeas()}>
          Generate with AI
        </button>
      </div>

      {thinking && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          Thinking with Gemini...
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
                onClick={() => setContent(i.title)}
              >
                {i.title}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="card" style={{ padding: 12, marginBottom: 12, color: '#991b1b', background:'#fff0f0', border:'1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="row">
          <input
            className="input grow"
            placeholder="Task title"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            className="input"
            style={{ maxWidth: 220 }}
            placeholder="Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
          <button className="btn" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>

      <div className="kanban">
        {COLUMNS.map((col) => (
          <div className="column" key={col.key}>
            <h3>
              {col.title} ({grouped[col.key]?.length || 0})
            </h3>
            {grouped[col.key]?.map((task) => (
              <div className="task" key={task.id}>
                <div style={{ fontWeight: 600 }}>{task.content}</div>
                <div className="meta">
                  <span className="chip">
                    {task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : ""}
                  </span>
                  <span className="assignee">
                    {task.assignedTo || "Unassigned"}
                  </span>
                </div>
                <div className="row" style={{ marginTop: 8 }}>
                  {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                    <button
                      key={c.key}
                      className="btn secondary"
                      onClick={() => move(task, c.key)}
                    >
                      Move to {c.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
