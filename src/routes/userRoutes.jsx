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
 
  return (
    <Suspense fallback={ 
    <motion.div
      style={{
        width: 50,
        height: 50,
        border: "5px solid #ccc",
        borderTop: "5px solid black",
        borderRadius: "50%",
        margin: "100px auto"
      }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }}
    ><motion.div
      style={{
        width: 50,
        height: 50,
        border: "5px solid #ccc",
        borderTop: "5px solid black",
        borderRadius: "50%",
        margin: "100px auto"
      }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }}
    ></motion.div></motion.div>}>
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