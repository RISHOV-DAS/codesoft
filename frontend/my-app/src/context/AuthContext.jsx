import React from "react";

const AuthContext = React.createContext({
  token: "",
  userId: "",
  setToken: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setTokenState] = React.useState("");
  const [userId, setUserId] = React.useState("");

  React.useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setTokenState(t);
    setUserId(decodeUserId(t));
  }, []);

  function setToken(t) {
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(t || "");
    setUserId(decodeUserId(t || ""));
  }

  function logout() {
    setToken("");
  }

  const value = React.useMemo(() => ({ token, userId, setToken, logout }), [token, userId, setToken, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

function decodeUserId(jwtToken) {
  try {
    if (!jwtToken) return "";
    const parts = jwtToken.split(".");
    if (parts.length < 2) return "";
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return String(payload.id || "");
  } catch (_) {
    return "";
  }
}
