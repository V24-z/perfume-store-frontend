import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth.jsx";
import axios from "axios";

// ─── All logic preserved exactly as-is ───────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL;

// ── Eye Icon — same as Signup ─────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    {open ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    )}
  </svg>
);

// ── Field wrapper — same as Signup ────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-[#1a0533] tracking-wide">
      {label}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
        <svg
          className="w-3 h-3 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ── Input class helper — same as Signup ───────────────────────────────────
const inputCls = (hasError) =>
  `w-full h-11 px-4 rounded-xl text-sm text-[#1a0533] placeholder-gray-400 bg-white outline-none
   border transition-all duration-200
   ${hasError
    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
    : "border-slate-200 hover:border-slate-300 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/10"
  }`;

function Login() {
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email || !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email";
    }
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

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/login`, form);
      console.log("Login response:", data);
      // Save user and JWT
      login(data.user, data.access_token);

      setMessage("Logged in successfully");
      setForm({
        email: "",
        password: "",
      });

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        setServerError(err.response.data.detail || "Login failed");
      } else {
        setServerError("Connection error!");
      }
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* ── Brand mark — identical to Signup ── */}
      <div className="flex items-center justify-center gap-3 mb-7">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(to right, #1a0533, #2d0a4e, #4a1060)",
          }}
        >
          <span style={{ color: "#fde047", fontSize: 20, lineHeight: 1 }}>
            ◈
          </span>
        </div>
        <div>
          <p
            className="font-bold text-lg m-0 leading-tight"
            style={{ color: "#1a0533", letterSpacing: "0.12em" }}
          >
            LUMIÈRE
          </p>
          <p
            className="m-0 font-medium"
            style={{
              color: "rgba(250,204,21,0.85)",
              fontSize: 10,
              letterSpacing: "0.22em",
            }}
          >
            PARFUM
          </p>
        </div>
      </div>

      {/* ── Card — identical structure to Signup ── */}
      <div className="w-full max-w-[460px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top accent strip */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(to right, #1a0533, #2d0a4e, #4a1060)",
          }}
        />

        <div className="px-7 py-8 sm:px-8">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-[#1a0533] tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Sign in to continue your fragrance journey
            </p>
          </div>

          {/* Success banner */}
          {message && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              <svg
                className="w-4 h-4 shrink-0 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              {message}
            </div>
          )}

          {/* Server error banner */}
          {serverError && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email Address" error={error.email}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="isabelle@example.com"
                className={inputCls(!!error.email)}
              />
            </Field>

            {/* Password with Forgot link in label row */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1a0533] tracking-wide">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`${inputCls(!!error.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-[#534AB7] transition-colors duration-150"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {error.password && (
                <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                  <svg
                    className="w-3 h-3 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.password}
                </p>
              )}
            </div>

            {/* CTA — identical to Signup button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 mt-1 rounded-full text-sm font-bold tracking-wide transition-all duration-200
    ${loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:brightness-105 hover:scale-[1.01] active:scale-[0.99]"
                }`}
              style={{
                background: "#facc15",
                color: "#3b0764",
                boxShadow: "0 2px 12px rgba(250,204,21,0.30)",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Create account link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold hover:underline transition-colors duration-150"
              style={{ color: "#534AB7" }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
