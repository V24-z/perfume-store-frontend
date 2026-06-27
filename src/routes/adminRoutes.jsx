import { Routes, Route } from "react-router-dom";
//import AdminLayout from "../admin/layouts/AdminLayout";
//import Dashboard from "../admin/pages/Dashboard";
//import Products from "../admin/pages/Products";
//import Banner from "../admin/pages/Banner.jsx";
//import Users from "../admin/pages/Users.jsx";
//import AdminRoute from "./adminroute.jsx";
//import Category from "../admin/pages/category.jsx";
import { lazy, Suspense } from "react";

const AdminLayout =lazy(()=>import('../admin/layouts/AdminLayout.jsx'));

const Dashboard=lazy(()=>import('../admin/pages/Dashboard.jsx'));
const Products =lazy(()=>import('../admin/pages/Products.jsx'));
const Banner =lazy(()=>import('../admin/pages/Banner.jsx'));
const Users =lazy(()=>import('../admin/pages/Users.jsx'));
const Category =lazy(()=>import('../admin/pages/category.jsx'));
const  AdminRoute=lazy(()=>import('./adminroute.jsx'));

const Orders =lazy(()=>import('../admin/pages/orders.jsx'))

const AdminRoutes = () => {
  
  return (
    <Suspense rollback={<div>Loadin...</div>}>
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
          <Route path="category" element={<Category />}/>      
            
         <Route path="orders" element={<Orders />}/>      


      </Route>
    </Routes>
    </Suspense>
  );
};

export default AdminRoutes;