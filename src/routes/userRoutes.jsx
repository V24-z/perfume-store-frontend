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
const Checkout = lazy(() => import("../Pages/checkout.jsx"));
const OrderSuccess = lazy(() => import("../Pages/success_page.jsx"));
const Order = lazy(() => import("../Pages/order.jsx"));
const Shop = lazy(() => import("../Pages/shop.jsx"));
const Wishlist = lazy(() => import("../Pages/wishlist.jsx"));

function UserRoutes() {
  return (
    <Suspense
      fallback={
        <motion.div
          style={{
            width: 50,
            height: 50,
            border: "5px solid #CECBF6",
            borderTop: "5px solid #534AB7",
            borderRadius: "50%",
            margin: "100px auto",
          }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        ></motion.div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/viewdetail/:id" element={<ViewSingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order" element={<Order />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
        <Route path="/Profile" element={<Profile />} />
        <Route path="/order/:orderId" element={<Order />} />      </Routes>
    </Suspense>
  );
}

export default UserRoutes;
