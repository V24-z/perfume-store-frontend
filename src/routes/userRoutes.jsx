import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";


const Layout = lazy(() => import("../components/layout.jsx"));
const Home = lazy(() => import("../Pages/home.jsx"));
const About = lazy(() => import("../Pages/about.jsx"));
const Contact = lazy(() => import("../Pages/contact.jsx"));
const ViewSingleProduct = lazy(() => import("../Pages/viewdetail.jsx"));
const Cart = lazy(() => import("../Pages/cart.jsx"));
const Profile = lazy(() => import("../components/user/Profile.jsx"));
const Checkout = lazy(()=>import("../Pages/checkout.jsx"))
function UserRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/viewdetail/:id" element={<ViewSingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout/>}/>
        </Route>
        <Route path="/Profile" element={<Profile />} />
        
        
      </Routes>
    </Suspense>
  );
}

export default UserRoutes;