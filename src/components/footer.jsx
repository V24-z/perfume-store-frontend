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
  { label: "IG", name: "Instagram", href: "#" },
  { label: "FB", name: "Facebook", href: "#" },
  { label: "PT", name: "Pinterest", href: "#" },
  { label: "TW", name: "Twitter", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e) {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    <footer
      className="w-full text-white"
      style={{
        background: "linear-gradient(160deg, #1a0533 0%, #0f0120 55%, #110028 100%)",
        borderTop: "1px solid rgba(250,204,21,0.10)",
      }}
    >
      {/* Thin gold accent line */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(250,204,21,0.45) 40%, rgba(250,204,21,0.45) 60%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr] gap-x-8 gap-y-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 no-underline mb-5 group">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: "rgba(250,204,21,0.12)",
                  border: "1px solid rgba(250,204,21,0.30)",
                  boxShadow: "0 0 18px rgba(250,204,21,0.08)",
                }}
              >
                <span className="text-yellow-300 text-lg leading-none">◈</span>
              </div>
              <div>
                <p className="text-white font-extrabold text-sm tracking-[0.18em] m-0 leading-none">
                  LUMIÈRE
                </p>
                <p
                  className="text-[9px] tracking-[0.28em] m-0 mt-0.5"
                  style={{ color: "rgba(250,204,21,0.55)" }}
                >
                  PARFUM
                </p>
              </div>
            </Link>

            <p
              className="text-sm leading-relaxed mb-6 max-w-[220px]"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Crafting timeless fragrances that tell your story. Every bottle, a memory.
            </p>

            <div className="flex gap-2 flex-wrap">
              {SOCIALS.map(({ label, name, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 no-underline cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.42)",
                    letterSpacing: "0.05em",
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

          {/* Nav columns */}
          {Object.entries(NAV).map(([heading, links]) => (
            <div key={heading}>
              <h3
                className="text-[10px] font-bold uppercase tracking-[0.20em] mb-5"
                style={{ color: "rgba(250,204,21,0.65)" }}
              >
                {heading}
              </h3>
              <ul className="list-none p-0 m-0 space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm no-underline transition-all duration-150 hover:translate-x-0.5 inline-block"
                      style={{ color: "rgba(255,255,255,0.42)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(253,224,71,0.95)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.42)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.20em] mb-5"
              style={{ color: "rgba(250,204,21,0.65)" }}
            >
              Newsletter
            </h3>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Early access to new arrivals and exclusive offers.
            </p>

            {joined ? (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(250,204,21,0.10)",
                  border: "1px solid rgba(250,204,21,0.25)",
                  color: "rgba(250,204,21,0.85)",
                }}
              >
                ✦ You're on the list.
              </div>
            ) : (
              <form onSubmit={handleJoin} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(250,204,21,0.40)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
                <button
                  type="submit"
                  className="w-full rounded-xl py-2.5 text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer"
                  style={{
                    background: "rgba(250,204,21,0.95)",
                    color: "#3b0764",
                    border: "none",
                    letterSpacing: "0.08em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fde047")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(250,204,21,0.95)")
                  }
                >
                  Join
                </button>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.20)" }}
                >
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p
            className="text-xs m-0 order-2 sm:order-1"
            style={{ color: "rgba(255,255,255,0.20)" }}
          >
            © 2026 Lumière Parfum. All rights reserved.
          </p>
          <div className="flex gap-6 order-1 sm:order-2">
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Use", to: "/terms" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-xs no-underline transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(253,224,71,0.7)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.22)")
                }
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