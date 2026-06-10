import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout.jsx";
import Home from "../Pages/home.jsx";
import About from "../Pages/about.jsx";
import Contact from "../Pages/contact.jsx";
import ViewSingleProduct from "../Pages/viewdetail.jsx";
import Cart from "../Pages/cart.jsx";
import Profile from "../components/user/Profile.jsx"
function UserRoutes() {
  return (
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
  );
}

export default UserRoutes;