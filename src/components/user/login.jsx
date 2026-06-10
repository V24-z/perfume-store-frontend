import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth.jsx";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function Login() {
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState(""); // server/network errors
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  setError({});
  setMessage("");
  setServerError("");

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setError(validationErrors);
    return;
  }

  try {
    const { data } = await axios.post(
      `${API_URL}/login`,
      form
    );

    // Save user in context
    login(data);

    setMessage("Logged in successfully");

    setForm({
      email: "",
      password: "",
    });

    console.log(data);

    if (data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (err) {
    if (err.response) {
      setServerError(
        err.response.data.detail || "Login failed"
      );
    } else {
      setServerError("Connection error!");
    }
  }
};
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 overflow-hidden">
      {/* Animated background circles */}
      <span className="absolute w-72 h-72 bg-white opacity-10 rounded-full -top-20 -left-20 animate-spin-slow"></span>
      <span className="absolute w-96 h-96 bg-white opacity-5 rounded-full -bottom-32 -right-32 animate-spin-slow-reverse"></span>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-fadeIn">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="flex flex-col animate-fadeIn delay-200">
            <label className="mb-2 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                error.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col animate-fadeIn delay-300 relative">
            <label className="mb-2 text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                error.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          {/* Display messages */}
          {message && <p className="text-green-600">{message}</p>}
          {serverError && <p className="text-red-600">{serverError}</p>}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition animate-fadeIn delay-400"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-gray-500 animate-fadeIn delay-500">
          Create an Account?{" "}
          <Link to={"/signup"} className="text-purple-600 hover:underline">
            signin
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
