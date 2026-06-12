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

// ─── Shared style objects ────────────────────────────────────────────────────
const S = {
  heading: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.20em",
    textTransform: "uppercase",
    marginBottom: 20,
    color: "rgba(250,204,21,0.65)",
    margin: "0 0 20px 0",
    padding: 0,
  },
  navLink: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    textDecoration: "none",
    display: "inline-block",
    transition: "color 0.15s",
    lineHeight: 1.4,
  },
  ul: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e) {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    /*
      KEY FIX: using a <div> wrapper with a CSS className defined in your
      global CSS / index.css instead of relying on inline style for the
      gradient — because some bundler/browser combos strip or override
      inline background on <footer> tags.

      Add this to your index.css or App.css:

        .lumiere-footer {
          background: linear-gradient(160deg, #1a0533 0%, #0f0120 55%, #110028 100%) !important;
        }

      The component below also keeps the inline style as a fallback.
    */
    <footer className="lumiere-footer" style={{ width: "100%", color: "#fff" }}>

      {/* Gold shimmer line — implemented as a <div> not a Tailwind class */}
      <div style={{
        width: "100%",
        height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(250,204,21,0.55) 40%, rgba(250,204,21,0.55) 60%, transparent 100%)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Main grid ────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "40px 40px",
          padding: "56px 0 48px",
        }}>

          {/* Brand */}
          <div style={{ minWidth: 0 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(250,204,21,0.14)",
                border: "1px solid rgba(250,204,21,0.32)",
              }}>
                <span style={{ color: "#fde047", fontSize: 18, lineHeight: 1 }}>◈</span>
              </div>
              <div>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.18em", margin: 0, lineHeight: 1 }}>LUMIÈRE</p>
                <p style={{ fontSize: 9, letterSpacing: "0.28em", margin: "3px 0 0", color: "rgba(250,204,21,0.55)" }}>PARFUM</p>
              </div>
            </Link>

            <p style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(255,255,255,0.38)", margin: "0 0 22px", maxWidth: 210 }}>
              Crafting timeless fragrances that tell your story. Every bottle, a memory.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SOCIALS.map(({ label, name }) => (
                <a key={name} href="#" aria-label={name}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    color: "rgba(255,255,255,0.42)",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#fde047";
                    e.currentTarget.style.borderColor = "rgba(250,204,21,0.45)";
                    e.currentTarget.style.background = "rgba(250,204,21,0.10)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.42)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div style={{ minWidth: 0 }}>
            <p style={S.heading}>Learn</p>
            <ul style={S.ul}>
              {NAV.Learn.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={S.navLink}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(253,224,71,0.95)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div style={{ minWidth: 0 }}>
            <p style={S.heading}>About</p>
            <ul style={{ ...S.ul, marginBottom: 28 }}>
              {NAV.About.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={S.navLink}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(253,224,71,0.95)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
            <p style={S.heading}>Support</p>
            <ul style={S.ul}>
              {NAV.Support.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={S.navLink}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(253,224,71,0.95)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ minWidth: 0 }}>
            <p style={S.heading}>Newsletter</p>
            <p style={{ fontSize: 13, lineHeight: 1.65, margin: "0 0 20px", color: "rgba(255,255,255,0.38)" }}>
              Early access to new arrivals and exclusive offers.
            </p>

            {joined ? (
              <div style={{
                borderRadius: 10, padding: "12px 16px", fontSize: 13,
                background: "rgba(250,204,21,0.10)",
                border: "1px solid rgba(250,204,21,0.28)",
                color: "rgba(250,204,21,0.85)",
              }}>✦ You're on the list.</div>
            ) : (
              <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="email" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    borderRadius: 10, padding: "10px 14px", fontSize: 13,
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    color: "#fff", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(250,204,21,0.45)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.13)")}
                />
                <button type="submit"
                  style={{
                    width: "100%", borderRadius: 10, padding: "10px 0",
                    fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
                    background: "#facc15", color: "#3b0764",
                    border: "none", cursor: "pointer", transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fde047")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#facc15")}
                >Join</button>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", margin: 0 }}>
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          padding: "18px 0",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 12,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", margin: 0 }}>
            © 2026 Lumière Parfum. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[{ label: "Privacy Policy", to: "/privacy" }, { label: "Terms of Use", to: "/terms" }].map(({ label, to }) => (
              <Link key={label} to={to}
                style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(253,224,71,0.70)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
              >{label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}