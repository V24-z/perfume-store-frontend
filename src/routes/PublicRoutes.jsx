import { Routes, Route } from "react-router-dom";
import Login from "../components/user/login";
import Signup from "../components/user/signup";
import Profile from "../components/user/Profile";

function PublicRoute(){
    return(<>
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
    <Route path="/Profile" element={<Profile />} />

</Routes>
    </> );
}
export default PublicRoute