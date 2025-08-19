import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken, logout } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/projects";

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await registerUser({ email, password });
      }
      const res = await loginUser({ email, password });
      if (res && res.token) {
        setToken(res.token);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  }

  function handleLogout() {
    logout();
  }

  return (
    <div className="container">
      <div
        className="card"
        style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}
      >
        <h2 style={{ margin: 0 }}>Authentication</h2>
        <p style={{ color: "var(--muted)" }}>
          Register or login to use the API.
        </p>
        {token ? (
          <div className="form">
            <div className="row">
              <div className="grow">
                <div className="input" style={{ wordBreak: "break-all" }}>
                  {token}
                </div>
              </div>
              <button
                className="btn"
                onClick={() => {
                  handleLogout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <div className="row">
              <button
                type="button"
                className={`btn secondary`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`btn secondary`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>
            <input
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn" type="submit">
              {mode === "login" ? "Login" : "Create account"}
            </button>
            {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
