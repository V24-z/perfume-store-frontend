//import AdminRoutes from "./routes/adminRoutes";
//import UserRoutes from "./routes/userRoutes.jsx";
//import Login from "./components/user/login.jsx";
//import Signup from "./components/user/signup.jsx";
import { useAuth } from "./context/useAuth.jsx";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const AdminRoutes = lazy(() => import("./routes/adminRoutes.jsx"));
const UserRoutes = lazy(() => import("./routes/userRoutes.jsx"));
const Login = lazy(() => import("./components/user/login.jsx"));
const Signup = lazy(() => import("./components/user/signup.jsx"));

function App() {
  const { user } = useAuth();

  return (
    <Suspense rollback={<div>Loading...</div>}>
      
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
      
    </Suspense>
  );
}

export default App;
