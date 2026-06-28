import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
// FIXED: Import the route guard synchronously to prevent rendering glitches
import AdminRoute from "./adminroute.jsx"; 

// Lazy load actual visual pages to optimize chunk sizing
const AdminLayout = lazy(() => import('../admin/layouts/AdminLayout.jsx'));
const Dashboard = lazy(() => import('../admin/pages/Dashboard.jsx'));
const Products = lazy(() => import('../admin/pages/Products.jsx'));
const Banner = lazy(() => import('../admin/pages/Banner.jsx'));
const Users = lazy(() => import('../admin/pages/Users.jsx'));
const Category = lazy(() => import('../admin/pages/category.jsx'));
const CreateAdmin = lazy(() => import('../admin/pages/createAdmin.jsx'));
const Orders = lazy(() => import('../admin/pages/orders.jsx'));

const AdminRoutes = () => {
  
  return (
    // FIXED: Changed property from "rollback" to the standard React "fallback" property
    <Suspense fallback={<div className="p-6 text-xs text-slate-400 font-semibold animate-pulse">Loading secure panel...</div>}>
      <Routes>
        <Route
          path="/" // <-- Relative to /admin/* in App.jsx
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />              {/* /admin */}
          <Route path="products" element={<Products />} />      {/* /admin/products */}
          <Route path="users" element={<Users />} />            {/* /admin/users */}
          <Route path="Banner" element={<Banner />} />          {/* /admin/Banner */}
          <Route path="category" element={<Category />} />      {/* /admin/category */}
          <Route path="orders" element={<Orders />} />          {/* /admin/orders */}
          <Route path="createAdmin" element={<CreateAdmin />} />{/* /admin/createAdmin */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;