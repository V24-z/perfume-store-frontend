import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState(""); // server/network errors
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email";
    // Phone validation (10 digits)
    if (!form.phon.match(/^\d{10}$/))
      newErrors.phon = "Phone number must be 10 digits";

    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phon: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 const handleSubmit = async (e) => {
  e.preventDefault();

  setError({});
  setServerError("");
  setMessage("");

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setError(validationErrors);
    return;
  }

  try {
     await axios.post(
      `${API_URL}/signin`,
      form
    );

    setMessage("User created successfully");

    setForm({
      name: "",
      email: "",
      phon: "",
      password: "",
    });

    // Optional: trigger n8n webhook
    await axios.post(
      "https://n8n-task.app.n8n.cloud/webhook/user-registration",
      {
        name: form.name,
        email: form.email,
      }
    );

    setTimeout(() => {
      navigate("/login");
    }, 1000);

  } catch (err) {
    if (err.response) {
      // Backend returned an error
      setServerError(
        err.response.data.detail || "Something went wrong!"
      );
    } else {
      // Network error
      setServerError("Unable to connect to server");
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
          {/* Name Field */}
          <div className="flex flex-col animate-fadeIn delay-100">
            <label className="mb-2 text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                error.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}
          </div>

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
          {/* Phono no Field */}
          <div className="flex flex-col animate-fadeIn delay-150">
            <label className="mb-2 text-gray-700 font-medium">Phone</label>
            <input
              type="phone"
              name="phon"
              value={form.phon}
              onChange={handleChange}
              placeholder="XXXXXXXXXX"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {error.phon && (
            <p className="text-red-500 text-sm mt-1">{error.phon}</p>
          )}

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
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-center text-gray-500 animate-fadeIn delay-500">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
export default Signup;
