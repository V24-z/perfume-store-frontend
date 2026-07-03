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

  // FIXED: Now accepts the refreshToken from your backend login response
  const login = (userData, token, refreshToken) => {
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", token);
    
    // Store the refresh token
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken); 
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("access_token"); 
    // FIXED: Ensure the refresh token is wiped out on logout
    localStorage.removeItem("refresh_token"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};