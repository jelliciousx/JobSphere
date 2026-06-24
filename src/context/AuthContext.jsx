import { createContext, useContext, useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import api from "../services/api.js";

const AuthContext = createContext();

// Helper to decode JWT payload without verification
const decodeToken = (token) => {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // First, try to get user from decoded token (fast)
      const decoded = decodeToken(token);
      if (decoded?.id) {
        // Set basic user info from token while we fetch full details
        setUser({
          _id: decoded.id,
          // Other fields will be filled by the API call
        });
      }

      // Then fetch full user details from API
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data); // data includes avatar, name, email, etc.
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <GoogleOAuthProvider clientId="460341921705-4d3vt1t9hm8erps216t5ea6cf46bakbt.apps.googleusercontent.com">
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          loading,
          isAdmin: user?.role === "admin",
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
