import { Routes, Route } from "react-router-dom";
//import Layout from "../components/layout.jsx";
//import Home from "../Pages/home.jsx";
//import About from "../Pages/about.jsx";
//import Contact from "../Pages/contact.jsx";
//import ViewSingleProduct from "../Pages/viewdetail.jsx";
//import Cart from "../Pages/cart.jsx";
//import Profile from "../components/user/Profile.jsx"
import { lazy, Suspense } from "react";
const Layout =lazy(()=>import ('../components/layout.jsx'));
const Home=lazy(()=>import ('../Pages/home.jsx'));
const About=lazy(()=>import ('../Pages/about.jsx'));
const Contact=lazy(()=>import('../Pages/contact.jsx'));
const ViewSingleProduct=lazy(()=>import ('../Pages/viewdetail.jsx'));
const Cart=lazy(()=>import('../Pages/cart.jsx'));
const Profile=lazy(()=>import('../components/user/Profile.jsx'))
function UserRoutes() {
  return (
    <Suspense fallback={<div>Loading....</div>}>  
    <Routes>
      {/* Pages with header/footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/Profile" element={<Profile/>}/>
      <Route path="/viewdetail/:id" element={<ViewSingleProduct />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
    </Suspense>
  );
}

export default UserRoutes;