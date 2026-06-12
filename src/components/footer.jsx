import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#1a0533] to-[#110222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-6">

        <div className="grid grid-cols-auto sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(250,204,21,0.15)",
                  border: "1px solid rgba(250,204,21,0.35)",
                }}
              >
                <span className="text-yellow-300 text-base">◈</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-[0.1em] m-0">LUMIÈRE</p>
                <p className="text-[9px] tracking-[0.2em] m-0" style={{ color: "rgba(250,204,21,0.6)" }}>
                  PARFUM
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Crafting timeless fragrances that tell your story. Every bottle, a memory.
            </p>

            {/* ✅ Fixed: <a tag was missing opening bracket */}
            <div className="flex gap-2">
              {[
                { label: "Ig", name: "Instagram" },
                { label: "Fb", name: "Facebook" },
                { label: "Pt", name: "Pinterest" },
                { label: "Tw", name: "Twitter" },
              ].map(({ label, name }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all no-underline"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fde047";
                    e.currentTarget.style.borderColor = "rgba(250,204,21,0.4)";
                    e.currentTarget.style.background = "rgba(250,204,21,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Learn column */}
          <div>
            <h3 className="text-yellow-400 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4">
              Learn
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {[
                { label: "Perfume Guide", to: "/learn/guide" },
                { label: "Fragrance Notes Explained", to: "/learn/notes" },
                { label: "How to Choose a Perfume", to: "/learn/choose" },
                { label: "Perfume Care Tips", to: "/learn/care" },
                { label: "Blog", to: "/blog" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-xs no-underline hover:text-yellow-300 transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About + Support column */}
          <div>
            <h3 className="text-yellow-400 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4">
              About
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {[
                { label: "Our Story", to: "/about" },
                { label: "Ingredients", to: "/about/ingredients" },
                { label: "Sustainability", to: "/about/sustainability" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-xs no-underline hover:text-yellow-300 transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-yellow-400 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4 mt-7">
              Support
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {[
                { label: "Contact Us", to: "/contact" },
                { label: "FAQs", to: "/faq" },
                { label: "Shipping & Returns", to: "/shipping" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-xs no-underline hover:text-yellow-300 transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div>
            <h3 className="text-yellow-400 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4">
              Newsletter
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Get early access to new arrivals and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 rounded-lg px-3 py-2 text-xs focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(250,204,21,0.4)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
              />
              <button
                className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-xs font-bold px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer"
                style={{ border: "none" }}
              >
                Join
              </button>
            </div>
            <p className="text-[10px] mt-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>
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
                className="text-xs no-underline hover:text-yellow-300 transition-colors"
                style={{ color: "rgba(255,255,255,0.2)" }}
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