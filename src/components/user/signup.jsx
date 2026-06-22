import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const inputClass = (hasError) =>
  `w-full h-12 px-4 text-sm text-[#111827] placeholder-[#9CA3AF] bg-white border rounded-xl transition-all duration-200 outline-none
   ${hasError
     ? "border-[#EF4444] focus:ring-2 focus:ring-red-200"
     : "border-[#E5E7EB] focus:border-[#FF9900] focus:ring-2 focus:ring-orange-100"
   }`;

const Field = ({ label, children, errorKey, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-[#111827] tracking-wide">
      {label}
    </label>
    {children}
    {error[errorKey] && (
      <p className="flex items-center gap-1 text-[#EF4444] text-xs font-medium mt-0.5">
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        {error[errorKey]}
      </p>
    )}
  </div>
);

function Signup() {
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phon: "",
    password: "",
  });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email";
    if (!form.phon.match(/^\d{10}$/))
      newErrors.phon = "Phone number must be 10 digits";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

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
      await axios.post(`${API_URL}/signin`, form);
      setMessage("User created successfully");
      setForm({ name: "", email: "", phon: "", password: "" });

      await axios.post(
        "https://task-ocr.app.n8n.cloud/webhook/user-registration",
        { name: form.name, email: form.email }
      );

      setTimeout(() => { navigate("/login"); }, 1000);
    } catch (err) {
      if (err.response) {
        setServerError(err.response.data.detail || "Something went wrong!");
      } else {
        setServerError("Unable to connect to server");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-10">

      {/* ── Wordmark / brand bar ── */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <span className="text-2xl font-extrabold tracking-tight text-[#131921]">
          shop<span className="text-[#FF9900]">hub</span>
        </span>
        <span className="text-[11px] uppercase tracking-widest text-[#6B7280] font-medium">
          Premium Marketplace
        </span>
      </div>

      {/* ── Auth card ── */}
      <div className="w-full max-w-[500px] bg-white border border-[#E5E7EB] rounded-2xl shadow-xl shadow-gray-100/70 overflow-hidden">

        {/* Amber accent bar at top */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9900] via-[#FFB84D] to-[#FF9900]" />

        <div className="px-8 py-9 sm:px-10">

          {/* ── Header ── */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight leading-snug">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Join thousands of customers discovering premium products.
            </p>
          </div>

          {/* ── Success banner ── */}
          {message && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-[#22C55E] text-sm font-medium">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )}

          {/* ── Server error banner ── */}
          {serverError && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[#EF4444] text-sm font-medium">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <Field label="Full Name" errorKey="name" error={error}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass(!!error.name)}
              />
            </Field>

            <Field label="Email Address" errorKey="email" error={error}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={inputClass(!!error.email)}
              />
            </Field>

            <Field label="Phone Number" errorKey="phon" error={error}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6B7280] font-medium select-none">
                  +91
                </span>
                <input
                  type="tel"
                  name="phon"
                  value={form.phon}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXX"
                  className={`${inputClass(!!error.phon)} pl-12`}
                />
              </div>
            </Field>

            <Field label="Password" errorKey="password" error={error}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`${inputClass(!!error.password)} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6B7280] hover:text-[#FF9900] transition-colors duration-150 px-1 py-0.5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              className="w-full h-12 mt-1 bg-[#FF9900] hover:bg-[#FFB84D] active:scale-[0.98] text-[#111827] text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-orange-100 tracking-wide"
            >
              Create Account
            </button>
          </form>

          {/* ── Trust badges ── */}
          <div className="mt-6 flex items-center justify-center gap-5 text-[#9CA3AF]">
            {[
              { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", label: "Secure" },
              { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", label: "Trusted" },
              { icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z", label: "Safe Pay" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                {label}
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="my-6 border-t border-[#E5E7EB]" />

          {/* ── Login link ── */}
          <p className="text-center text-sm text-[#6B7280]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-[#FF9900] hover:text-[#FFB84D] transition-colors duration-150 underline underline-offset-2"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* ── Footer note ── */}
      <p className="mt-6 text-xs text-[#9CA3AF] text-center max-w-xs">
        By creating an account, you agree to our{" "}
        <span className="text-[#6B7280] underline cursor-pointer hover:text-[#FF9900] transition-colors">Terms</span>
        {" "}and{" "}
        <span className="text-[#6B7280] underline cursor-pointer hover:text-[#FF9900] transition-colors">Privacy Policy</span>.
      </p>
    </div>
  );
}

export default Signup;
