import { useState } from "react";
import { Link } from "react-router-dom";

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

function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e) {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    /* 
      KEY: background is in style={} not className.
      Tailwind v4 cannot process arbitrary hex values like from-[#1a0533].
      style={} is always safe — it goes directly to the DOM, Tailwind never touches it.
    */
    <footer
      style={{
        background: "linear-gradient(to bottom, #1a0533, #110222)",
        width: "100%",
        color: "#fff",
      }}
    >
      {/* Gold shimmer top line */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(250,204,21,0.5), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div
                style={{
                  width: 36, height: 36,
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(250,204,21,0.15)",
                  border: "1px solid rgba(250,204,21,0.35)",
                }}
              >
                <span style={{ color: "#fde047", fontSize: 16 }}>◈</span>
              </div>
              <div>
                <p className="font-bold text-sm m-0" style={{ color: "#fff", letterSpacing: "0.1em" }}>
                  LUMIÈRE
                </p>
                <p className="m-0" style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(250,204,21,0.6)" }}>
                  PARFUM
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Crafting timeless fragrances that tell your story. Every bottle, a memory.
            </p>

            <div className="flex gap-2 flex-wrap">
              {SOCIALS.map(({ label, name }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex items-center justify-center text-xs font-bold no-underline transition-all"
                  style={{
                    width: 32, height: 32,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fde047";
                    e.currentTarget.style.borderColor = "rgba(250,204,21,0.4)";
                    e.currentTarget.style.background = "rgba(250,204,21,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3
              className="text-xs font-semibold uppercase mb-4"
              style={{ color: "rgba(250,204,21,0.8)", letterSpacing: "0.12em" }}
            >
              Learn
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {NAV_LEARN.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-xs no-underline transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fde047")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About + Support */}
          <div>
            <h3
              className="text-xs font-semibold uppercase mb-4"
              style={{ color: "rgba(250,204,21,0.8)", letterSpacing: "0.12em" }}
            >
              About
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0 mb-6">
              {NAV_ABOUT.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-xs no-underline transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fde047")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3
              className="text-xs font-semibold uppercase mb-4"
              style={{ color: "rgba(250,204,21,0.8)", letterSpacing: "0.12em" }}
            >
              Support
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {NAV_SUPPORT.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-xs no-underline transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fde047")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="text-xs font-semibold uppercase mb-4"
              style={{ color: "rgba(250,204,21,0.8)", letterSpacing: "0.12em" }}
            >
              Newsletter
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Get early access to new arrivals and exclusive offers.
            </p>

            {joined ? (
              <div
                className="text-xs rounded-lg px-3 py-2.5"
                style={{
                  background: "rgba(250,204,21,0.1)",
                  border: "1px solid rgba(250,204,21,0.3)",
                  color: "rgba(250,204,21,0.9)",
                }}
              >
                ✦ You're on the list!
              </div>
            ) : (
              <form onSubmit={handleJoin} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-lg px-3 py-2 text-xs focus:outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(250,204,21,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
                />
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer"
                  style={{
                    background: "#facc15",
                    color: "#3b0764",
                    border: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fde047")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#facc15")}
                >
                  Join
                </button>
              </form>
            )}

            <p className="mt-2.5" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs m-0" style={{ color: "rgba(255,255,255,0.2)" }}>
            © 2026 Lumière Parfum. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Use", to: "/terms" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-xs no-underline transition-colors"
                style={{ color: "rgba(255,255,255,0.2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(253,224,71,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;