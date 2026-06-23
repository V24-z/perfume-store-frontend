import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ── Animated floating orb ──────────────────────────────────────────────────
const Orb = ({ className }) => (
  <div className={`absolute rounded-full pointer-events-none ${className}`} />
);

// ── Icon components ────────────────────────────────────────────────────────
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    )}
  </svg>
);

// ── Input field ────────────────────────────────────────────────────────────
const LuxuryInput = ({
  label, name, type = "text", value, onChange,
  placeholder, icon, error, rightEl,
}) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors group-focus-within:text-yellow-300/80">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-yellow-300/60">
          <Icon path={icon} className="w-4 h-4" />
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`
          w-full h-12 rounded-xl text-sm text-white placeholder-white/20
          bg-white/5 border transition-all duration-300 outline-none
          ${icon ? "pl-11" : "pl-4"}
          ${rightEl ? "pr-12" : "pr-4"}
          ${error
            ? "border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            : "border-white/10 focus:border-yellow-300/60 focus:ring-2 focus:ring-yellow-300/10 hover:border-white/20"
          }
        `}
      />
      {rightEl && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</span>
      )}
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-red-400 text-xs font-medium animate-[fadeIn_0.2s_ease]">
        <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
function Signup() {
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phon: "", password: "", confirm: "",
  });

  useEffect(() => {
    // Trigger entrance animation after mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(form.phon)) e.phon = "Enter a 10-digit phone number";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setServerError("");
    setMessage("");
    const errs = validate();
    if (Object.keys(errs).length) { setError(errs); return; }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/signin`, form);
      setMessage("Account created — welcome to Lumière.");
      setForm({ name: "", email: "", phon: "", password: "", confirm: "" });
      await axios.post("https://task-ocr.app.n8n.cloud/webhook/user-registration", {
        name: form.name, email: form.email,
      });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setServerError(err.response?.data?.detail || "Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Authentic luxury fragrances" },
    { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Curated premium collections" },
    { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Secure & encrypted checkout" },
    { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Worldwide express delivery" },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden flex"
      style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d0a4e 45%, #4a1060 100%)" }}
    >
      {/* ── Background orbs ── */}
      <Orb className="w-[500px] h-[500px] -top-32 -left-32 bg-purple-700/20 blur-[120px]" />
      <Orb className="w-[400px] h-[400px] bottom-0 right-0 bg-yellow-400/10 blur-[100px]" />
      <Orb className="w-[300px] h-[300px] top-1/2 left-1/3 bg-fuchsia-600/10 blur-[80px]" />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ══════════════════════════════════════════
          Desktop two-column / Mobile stacked
      ══════════════════════════════════════════ */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row">

        {/* ── LEFT HERO (40%) ────────────────────────── */}
        <div
          className={`
            lg:w-[40%] flex flex-col justify-center px-10 py-14 lg:py-0 lg:px-16
            transition-all duration-700 ease-out
            ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}
          `}
        >
          {/* Wordmark */}
          <div className="mb-12 lg:mb-16">
            <div className="flex items-center gap-3 mb-2">
              {/* Monogram badge */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                <span className="text-purple-900 font-black text-base tracking-tighter">L</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Lumière<span className="text-yellow-300">Parfum</span>
              </span>
            </div>
            <p className="text-white/30 text-xs uppercase tracking-[0.25em] ml-[52px]">
              Maison de Parfum
            </p>
          </div>

          {/* Hero headline */}
          <div className="mb-10">
            <p className="text-yellow-300/70 text-xs uppercase tracking-[0.3em] font-semibold mb-4">
              Welcome
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
              Discover<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #fde047, #facc15, #fbbf24)" }}>
                Luxury
              </span>{" "}
              <br />
              Fragrances
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-xs">
              Join thousands of connoisseurs exploring the world's finest fragrance houses — curated for those who appreciate artistry.
            </p>
          </div>

          {/* Benefits */}
          <ul className="space-y-4 mb-12">
            {benefits.map((b) => (
              <li key={b.text} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-300/15 flex items-center justify-center">
                  <svg className="w-3 h-3 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-white/60 text-sm">{b.text}</span>
              </li>
            ))}
          </ul>

          {/* Decorative scent notes */}
          <div className="hidden lg:flex items-center gap-3 mt-auto">
            {["Bergamot", "Oud", "Rose", "Amber"].map((note, i) => (
              <span
                key={note}
                className="text-[10px] uppercase tracking-widest text-white/20 font-medium"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {note}{i < 3 && <span className="ml-3 text-yellow-400/30">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT FORM (60%) ────────────────────────── */}
        <div
          className={`
            lg:w-[60%] flex items-center justify-center px-5 py-10 lg:py-12
            transition-all duration-700 delay-150 ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="w-full max-w-[500px]">

            {/* Glassmorphism card */}
            <div
              className="rounded-3xl border border-white/10 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Gold top accent */}
              <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #facc15, transparent)" }} />

              <div className="px-8 py-9 sm:px-10">

                {/* Card header */}
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                    style={{ background: "linear-gradient(135deg, rgba(253,224,71,0.2), rgba(250,204,21,0.05))", border: "1px solid rgba(253,224,71,0.2)" }}>
                    <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
                  <p className="mt-1.5 text-sm text-white/40">Begin your journey into luxury fragrance</p>
                </div>

                {/* Success banner */}
                {message && (
                  <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-yellow-300 font-medium"
                    style={{ background: "rgba(253,224,71,0.08)", border: "1px solid rgba(253,224,71,0.2)" }}>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {message}
                  </div>
                )}

                {/* Server error */}
                {serverError && (
                  <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 font-medium"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    {serverError}
                  </div>
                )}

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <LuxuryInput
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Isabelle Moreau"
                    icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    error={error.name}
                  />

                  <LuxuryInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="isabelle@example.com"
                    icon="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    error={error.email}
                  />

                  {/* Phone with prefix */}
                  <div className="flex flex-col gap-1.5 group">
                    <label className="text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors group-focus-within:text-yellow-300/80">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium select-none flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phon"
                        value={form.phon}
                        onChange={handleChange}
                        placeholder="XXXXXXXXXX"
                        className={`
                          w-full h-12 pl-16 pr-4 rounded-xl text-sm text-white placeholder-white/20
                          bg-white/5 border transition-all duration-300 outline-none
                          ${error.phon
                            ? "border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                            : "border-white/10 focus:border-yellow-300/60 focus:ring-2 focus:ring-yellow-300/10 hover:border-white/20"
                          }
                        `}
                      />
                    </div>
                    {error.phon && (
                      <p className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {error.phon}
                      </p>
                    )}
                  </div>

                  <LuxuryInput
                    label="Password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    icon="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    error={error.password}
                    rightEl={
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="text-white/30 hover:text-yellow-300/70 transition-colors duration-200"
                      >
                        <EyeIcon open={showPwd} />
                      </button>
                    }
                  />

                  <LuxuryInput
                    label="Confirm Password"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    icon="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    error={error.confirm}
                    rightEl={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-white/30 hover:text-yellow-300/70 transition-colors duration-200"
                      >
                        <EyeIcon open={showConfirm} />
                      </button>
                    }
                  />

                  {/* CTA button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      relative w-full h-12 mt-2 rounded-xl font-bold text-sm tracking-wide
                      transition-all duration-300 overflow-hidden
                      ${loading
                        ? "opacity-60 cursor-not-allowed bg-yellow-300 text-purple-900"
                        : "bg-yellow-300 text-purple-900 hover:bg-yellow-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] active:scale-[0.98]"
                      }
                    `}
                    style={{ boxShadow: "0 4px 24px rgba(250,204,21,0.25)" }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating Account…
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/25 font-medium tracking-widest uppercase">or continue with</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Google SSO */}
                <button
                  type="button"
                  className="w-full h-11 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                {/* Footer */}
                <div className="mt-6 space-y-3">
                  <p className="text-center text-sm text-white/30">
                    Already a member?{" "}
                    <a href="/login" className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors duration-150">
                      Sign In
                    </a>
                  </p>
                  <p className="text-center text-xs text-white/20 leading-relaxed">
                    By joining, you agree to our{" "}
                    <span className="text-white/35 hover:text-yellow-300/70 cursor-pointer transition-colors underline underline-offset-2">Terms of Service</span>
                    {" "}and{" "}
                    <span className="text-white/35 hover:text-yellow-300/70 cursor-pointer transition-colors underline underline-offset-2">Privacy Policy</span>.
                  </p>
                </div>
              </div>

              {/* Gold bottom accent */}
              <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.3), transparent)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe for fadeIn */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Signup;