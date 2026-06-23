import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ── Eye Icon ──────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    )}
  </svg>
);

// ── Reusable field wrapper ─────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
      {label}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
        <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

const inputBase = (hasError) => `
  w-full h-11 px-4 rounded-xl text-sm text-white placeholder-white/20 outline-none
  bg-white/5 border transition-all duration-200
  ${hasError
    ? "border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/15"
    : "border-white/10 hover:border-white/20 focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/10"
  }
`;

// ── Main component ─────────────────────────────────────────────────────────
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d0a4e 50%, #4a1060 100%)" }}
    >
      <div className="w-full max-w-[460px]">

        {/* ── Brand ── */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #fde047, #f59e0b)" }}
          >
            <span className="text-purple-900 font-black text-lg leading-none">L</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Lumière<span className="text-yellow-300">Parfum</span>
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/25 font-medium">
            Maison de Parfum
          </span>
        </div>

        {/* ── Card ── */}
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Gold hairline */}
          <div
            className="h-px w-full"
            style={{ background: "linear-gradient(90deg, transparent, #facc15 50%, transparent)" }}
          />

          <div className="px-8 py-8">

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-xl font-bold text-white tracking-tight">Create Your Account</h1>
              <p className="mt-1.5 text-sm text-white/35">
                Join thousands discovering premium fragrances
              </p>
            </div>

            {/* Success */}
            {message && (
              <div
                className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-yellow-300 font-medium"
                style={{ background: "rgba(253,224,71,0.08)", border: "1px solid rgba(253,224,71,0.18)" }}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {message}
              </div>
            )}

            {/* Server error */}
            {serverError && (
              <div
                className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-red-400 font-medium"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <Field label="Full Name" error={error.name}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Isabelle Moreau"
                  className={inputBase(!!error.name)}
                />
              </Field>

              <Field label="Email Address" error={error.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="isabelle@example.com"
                  className={inputBase(!!error.email)}
                />
              </Field>

              <Field label="Phone Number" error={error.phon}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30 font-medium select-none pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phon"
                    value={form.phon}
                    onChange={handleChange}
                    placeholder="XXXXXXXXXX"
                    className={`${inputBase(!!error.phon)} pl-12`}
                  />
                </div>
              </Field>

              <Field label="Password" error={error.password}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`${inputBase(!!error.password)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-yellow-300/70 transition-colors duration-150"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </Field>

              <button
                type="submit"
                className="w-full h-11 mt-1 rounded-xl text-sm font-bold tracking-wide text-purple-900 transition-all duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, #fde047, #facc15)",
                  boxShadow: "0 4px 20px rgba(250,204,21,0.25)",
                }}
              >
                Create Account
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 space-y-3 text-center">
              <p className="text-sm text-white/30">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors duration-150"
                >
                  Sign In
                </a>
              </p>
              <p className="text-xs text-white/18 leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>
                By creating an account you agree to our{" "}
                <span className="underline underline-offset-2 cursor-pointer hover:text-yellow-300/60 transition-colors">
                  Terms
                </span>{" "}
                and{" "}
                <span className="underline underline-offset-2 cursor-pointer hover:text-yellow-300/60 transition-colors">
                  Privacy Policy
                </span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;