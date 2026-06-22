import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// DATA ARRAYS — 100% unchanged
// ─────────────────────────────────────────────────────────────
const NAV_LEARN = [
  { label: "Perfume Guide", to: "/learn/guide" },
  { label: "Fragrance Notes", to: "/learn/notes" },
  { label: "How to Choose", to: "/learn/choose" },
  { label: "Care Tips", to: "/learn/care" },
  { label: "Blog", to: "/blog" },
];

const NAV_ABOUT = [
  { label: "Our Story", to: "/about" },
  { label: "Ingredients", to: "/about/ingredients" },
  { label: "Sustainability", to: "/about/sustainability" },
];

const NAV_SUPPORT = [
  { label: "Contact Us", to: "/contact" },
  { label: "FAQs", to: "/faq" },
  { label: "Shipping & Returns", to: "/shipping" },
];

const SOCIALS = [
  { label: "Ig", name: "Instagram" },
  { label: "Fb", name: "Facebook" },
  { label: "Pt", name: "Pinterest" },
  { label: "Tw", name: "Twitter" },
];

// ─────────────────────────────────────────────────────────────
// FOOTER — Premium Ecommerce Redesign
// Palette:
//   #131921  – darkest bg (main footer body)
//   #1a2332  – slightly lighter card bg
//   #232F3E  – secondary bg / dividers
//   #FF9900  – accent orange (headings, CTA)
//   #FFB84D  – accent hover
// All logic, state, functions, routes unchanged.
// ─────────────────────────────────────────────────────────────

function Footer() {
  // Logic unchanged
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e) {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    <footer className="w-full text-white" style={{ background: "#131921" }}>

      {/* ── Top accent line ─────────────────────────────────
          Thin orange bar mirrors the accent system.
          Replaces the purple gradient shimmer.
      ──────────────────────────────────────────────────── */}
      <div style={{ height: 3, background: "linear-gradient(to right, #131921, #FF9900, #131921)" }} />

      {/* ── Trust bar ───────────────────────────────────────
          Quick-glance USP strip (Amazon/Flipkart style).
          No new logic — purely decorative UI layer.
      ──────────────────────────────────────────────────── */}
      <div className="bg-[#232F3E] border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            { icon: "🚚", text: "Free Shipping above ₹1999" },
            { icon: "↩️", text: "Easy 30-Day Returns" },
            { icon: "🔒", text: "100% Secure Payments" },
            { icon: "✦", text: "Authentic Fragrances" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-white/60 whitespace-nowrap">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main footer body ────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-12 pb-8">

        {/* Main grid: 1 col → 2 col sm → 4 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Brand column ──────────────────────────────
              Logo + tagline + social icons.
              Orange badge icon matches Header design.
          ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Wordmark */}
            <Link to="/" className="flex items-center gap-2.5 no-underline group w-fit">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FF9900]/15 border border-[#FF9900]/35 group-hover:bg-[#FF9900]/25 transition-colors duration-200">
                <span className="text-[#FF9900] text-lg leading-none select-none">◈</span>
              </div>
              <div>
                <p className="font-extrabold text-sm m-0 text-white tracking-[0.12em] leading-tight">
                  LUMIÈRE
                </p>
                <p className="m-0 text-[#FF9900]/65 text-[9px] tracking-[0.22em] leading-tight font-medium">
                  PARFUM
                </p>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-white/45 leading-relaxed max-w-[220px]">
              Crafting timeless fragrances that tell your story. Every bottle, a memory.
            </p>

            {/* Social icon buttons */}
            <div className="flex gap-2.5 flex-wrap">
              {SOCIALS.map(({ label, name }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold no-underline
                             text-white/45 bg-white/6 border border-white/12
                             hover:text-[#FF9900] hover:border-[#FF9900]/40 hover:bg-[#FF9900]/10
                             hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,153,0,0.20)]
                             transition-all duration-200"
                  style={{}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FF9900";
                    e.currentTarget.style.borderColor = "rgba(255,153,0,0.4)";
                    e.currentTarget.style.background = "rgba(255,153,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Learn column ──────────────────────────────
              Section heading: orange accent.
              Links: muted → orange on hover.
          ────────────────────────────────────────────── */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF9900] mb-5">
              Learn
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              {NAV_LEARN.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/50 no-underline
                               hover:text-[#FF9900] transition-colors duration-150
                               relative after:absolute after:left-0 after:-bottom-px after:h-px after:w-0 after:bg-[#FF9900] after:transition-all after:duration-200 hover:after:w-full"
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF9900")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── About + Support column ────────────────────
              Two stacked sub-sections in one grid cell.
          ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* About */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF9900] mb-5">
                About
              </h3>
              <ul className="space-y-3 list-none p-0 m-0">
                {NAV_ABOUT.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-white/50 no-underline transition-colors duration-150"
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FF9900")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF9900] mb-5">
                Support
              </h3>
              <ul className="space-y-3 list-none p-0 m-0">
                {NAV_SUPPORT.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-white/50 no-underline transition-colors duration-150"
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FF9900")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Newsletter column ─────────────────────────
              Strongest CTA in the footer.
              Input: dark-glass → white focus ring.
              Button: solid orange Amazon-style.
              Success: green card.
              Logic 100% unchanged.
          ────────────────────────────────────────────── */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF9900] mb-5">
              Newsletter
            </h3>
            <p className="text-sm text-white/45 leading-relaxed mb-5">
              Get early access to new arrivals and exclusive offers.
            </p>

            {joined ? (
              /* Success state — green card */
              <div className="rounded-xl px-4 py-4 bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                <span className="text-green-400 text-lg leading-none mt-px">✓</span>
                <div>
                  <p className="text-sm font-semibold text-green-400 m-0 mb-0.5">You're on the list!</p>
                  <p className="text-xs text-green-400/70 m-0">Watch your inbox for exclusive drops.</p>
                </div>
              </div>
            ) : (
              /* Subscribe form — logic unchanged */
              <form onSubmit={handleJoin} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30
                             bg-white/6 border border-white/12 focus:outline-none
                             focus:border-[#FF9900]/60 focus:bg-white/10
                             transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255,153,0,0.55)";
                    e.target.style.background = "rgba(255,255,255,0.10)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.12)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                  }}
                />
                <button
                  type="submit"
                  className="w-full rounded-xl px-4 py-3 text-sm font-bold text-[#131921] cursor-pointer
                             transition-colors duration-200 border-none"
                  style={{ background: "#FF9900" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FFB84D")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#FF9900")}
                >
                  Subscribe →
                </button>
              </form>
            )}

            <p className="mt-3 text-[10px] text-white/25">
              No spam. Unsubscribe anytime.
            </p>
          </div>

        </div>

        {/* ── Divider ───────────────────────────────────── */}
        <div className="border-t border-white/10 mb-6" />

        {/* ── Bottom bar ────────────────────────────────
            Desktop: copyright left, policy links right.
            Mobile: stacked, centered.
            Logic (routes) unchanged.
        ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25 m-0 text-center sm:text-left">
            © 2026 Lumière Parfum. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Use", to: "/terms" },
            ].map(({ label, to }, i) => (
              <span key={label} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/15 text-xs">·</span>}
                <Link
                  to={to}
                  className="text-xs text-white/25 no-underline transition-colors duration-150"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF9900")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  {label}
                </Link>
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;