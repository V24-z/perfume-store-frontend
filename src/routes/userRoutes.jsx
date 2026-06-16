import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";


const Layout = lazy(() => import("../components/layout.jsx"));
const Home = lazy(() => import("../Pages/home.jsx"));
const About = lazy(() => import("../Pages/about.jsx"));
const Contact = lazy(() => import("../Pages/contact.jsx"));
const ViewSingleProduct = lazy(() => import("../Pages/viewdetail.jsx"));
const Cart = lazy(() => import("../Pages/cart.jsx"));
const Profile = lazy(() => import("../components/user/Profile.jsx"));
const Checkout = lazy(()=>import("../Pages/checkout.jsx"))
const OrderSuccess =lazy(()=>import("../Pages/success_page.jsx"))
function UserRoutes() {
  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      transition: {
        repeat: Infinity,
        duration: 0.6
      }
    }
  };

  return (
    <Suspense fallback={ 
      [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          animate="animate"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "black"
          }}
          transition={{ delay: i * 0.2 }}
        />
      ))}>
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
        <Route
  path="/order-success/:orderId"
  element={<OrderSuccess />}
/>
        
      </Routes>
    </Suspense>
  );
}

export default UserRoutes;