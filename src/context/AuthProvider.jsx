import { useState } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData, token) => {
  setUser(userData);

  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", token);
};

 const logout = () => {
  setUser(null);

  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};