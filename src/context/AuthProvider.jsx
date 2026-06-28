import { useState } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (userData, token) => {
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
    // FIXED: Shifted storage key from "token" to "access_token" to match your admin console components
    localStorage.setItem("access_token", token); 
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    // FIXED: Changed removal hook key to "access_token" to clean up session profiles correctly
    localStorage.removeItem("access_token"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
