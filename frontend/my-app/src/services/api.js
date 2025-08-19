// Base URL selection: in dev use explicit env variable if provided; otherwise default to localhost:5000
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL || "http://localhost:5000"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

async function http(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      message = j.msg || j.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Auth
export async function registerUser(body) {
  return http("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
export async function loginUser(body) {
  return http("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Projects
export async function getProjectsForUser(userId) {
  return http(`/api/projects/${userId}`);
}
export async function createProject(body) {
  return http("/api/projects/create", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Tasks
export async function getTasksForProject(userID, projectID) {
  return http(`/api/tasks/${userID}/projects/${projectID}/tasks`);
}
export async function createTask(body) {
  return http("/api/tasks/create", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
export async function updateTaskStatus(userID, projectID, taskID, status) {
  return http(
    `/api/tasks/${userID}/projects/${projectID}/tasks/${taskID}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );
}
