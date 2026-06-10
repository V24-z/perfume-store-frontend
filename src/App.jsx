import AdminRoutes from "./routes/adminRoutes";
import UserRoutes from "./routes/userRoutes.jsx";
import Login from "./components/user/login.jsx";
import Signup from "./components/user/signup.jsx";
import { useAuth } from "./context/useAuth.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  const { user } = useAuth();
console.log("APP USER:", user);
  return (
    <Routes>
       <Route path="/*" element={<UserRoutes />} />
      
      {!user && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </>
      )}

      {user && user.role === "admin" && (
        <Route path="/admin/*" element={<AdminRoutes />} />
      )}

      

      {/* Optional: redirect all unknown paths */}
      <Route path="*" element={user ? <UserRoutes /> : <Login />} />
    </Routes>
  );
}

export default App;
