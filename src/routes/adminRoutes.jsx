import { Routes, Route } from "react-router-dom";
import AdminLayout from "../admin/layouts/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import Products from "../admin/pages/Products";
import Banner from "../admin/pages/Banner.jsx";
import Users from "../admin/pages/Users.jsx";
import AdminRoute from "./adminroute";
import Category from "../admin/pages/category.jsx";
const AdminRoutes = () => {
  console.log("adminroutes")
  return (
    <Routes>
      <Route
        path="/"               // <-- Relative to /admin/* in App.jsx
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />   {/* /admin */}
        <Route path="products" element={<Products />} />  {/* /admin/products */}
        <Route path="users" element={<Users />} /> 
        <Route path="Banner" element={<Banner />}/>     
          <Route path="category" element={<Category />}/>       {/* /admin/users */}
  {/* /admin/users */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;