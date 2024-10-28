import React, { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    try {
      const response = await api.get("user-info/"); // Fetch user info after login
      // Set user data in the context with the username and is_admin flag
      setUser({
        username: response.data.username,
        is_admin: response.data.is_admin,
      });
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
