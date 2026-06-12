import { useState } from "react";
import { Link } from "react-router-dom";

const NAV = {
  Learn: [
    { label: "Perfume Guide", to: "/learn/guide" },
    { label: "Fragrance Notes", to: "/learn/notes" },
    { label: "How to Choose", to: "/learn/choose" },
    { label: "Care Tips", to: "/learn/care" },
    { label: "Blog", to: "/blog" },
  ],
  About: [
    { label: "Our Story", to: "/about" },
    { label: "Ingredients", to: "/about/ingredients" },
    { label: "Sustainability", to: "/about/sustainability" },
  ],
  Support: [
    { label: "Contact Us", to: "/contact" },
    { label: "FAQs", to: "/faq" },
    { label: "Shipping & Returns", to: "/shipping" },
  ],
};

const SOCIALS = [
  { label: "IG", name: "Instagram" },
  { label: "FB", name: "Facebook" },
  { label: "PT", name: "Pinterest" },
  { label: "TW", name: "Twitter" },
];

const navLinkStyle = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.42)",
  textDecoration: "none",
  display: "inline-block",
  transition: "color 0.15s",
};

const columnHeadingStyle = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.20em",
  textTransform: "uppercase",
  marginBottom: "20px",
  color: "rgba(250,204,21,0.65)",
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e) {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    <footer
      style={{
        width: "100%",
        color: "white",
        background: "linear-gradient(160deg, #1a0533 0%, #0f0120 55%, #110028 100%)",
        borderTop: "1px solid rgba(250,204,21,0.10)",
        fontFamily: "inherit",
      }}
    >
      {/* Gold shimmer line */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(250,204,21,0.50) 40%, rgba(250,204,21,0.50) 60%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* ── Main grid ── */}
        <div
          className="py-14"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "32px 40px",
          }}
        >
          {/* Brand column — full width on mobile */}
          <div style={{ gridColumn: "span 1" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: "rgba(250,204,21,0.12)",
                  border: "1px solid rgba(250,204,21,0.30)",
                  boxShadow: "0 0 18px rgba(250,204,21,0.08)",
                }}
              >
                <span style={{ color: "#fde047", fontSize: "18px", lineHeight: 1 }}>◈</span>
              </div>
              <div>
                <p style={{ color: "white", fontWeight: 800, fontSize: "13px", letterSpacing: "0.18em", margin: 0, lineHeight: 1 }}>
                  LUMIÈRE
                </p>
                <p style={{ fontSize: "9px", letterSpacing: "0.28em", margin: 0, marginTop: "3px", color: "rgba(250,204,21,0.55)" }}>
                  PARFUM
                </p>
              </div>
            </Link>

            <p style={{ fontSize: "13px", lineHeight: 1.7, marginBottom: "22px", color: "rgba(255,255,255,0.38)", maxWidth: "210px" }}>
              Crafting timeless fragrances that tell your story. Every bottle, a memory.
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {SOCIALS.map(({ label, name }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.42)",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fde047";
                    e.currentTarget.style.borderColor = "rgba(250,204,21,0.45)";
                    e.currentTarget.style.background = "rgba(250,204,21,0.10)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.42)";
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

          {/* Learn */}
          <div>
            <p style={columnHeadingStyle}>Learn</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {NAV.Learn.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={navLinkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(253,224,71,0.95)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About + Support */}
          <div>
            <p style={columnHeadingStyle}>About</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              {NAV.About.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={navLinkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(253,224,71,0.95)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <p style={columnHeadingStyle}>Support</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {NAV.Support.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={navLinkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(253,224,71,0.95)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p style={columnHeadingStyle}>Newsletter</p>
            <p style={{ fontSize: "13px", lineHeight: 1.6, marginBottom: "20px", color: "rgba(255,255,255,0.38)" }}>
              Early access to new arrivals and exclusive offers.
            </p>

            {joined ? (
              <div
                style={{
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  background: "rgba(250,204,21,0.10)",
                  border: "1px solid rgba(250,204,21,0.25)",
                  color: "rgba(250,204,21,0.85)",
                }}
              >
                ✦ You're on the list.
              </div>
            ) : (
              <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(250,204,21,0.40)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    padding: "10px 0",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    background: "rgba(250,204,21,0.95)",
                    color: "#3b0764",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fde047")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(250,204,21,0.95)")}
                >
                  Join
                </button>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.20)", margin: 0 }}>
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            padding: "18px 0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.20)", margin: 0 }}>
            © 2026 Lumière Parfum. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Use", to: "/terms" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(253,224,71,0.70)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
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