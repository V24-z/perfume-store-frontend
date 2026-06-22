import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// NAVBAR — Premium Ecommerce Redesign
// Palette matches Header:
//   #131921  – main bg (header bar)
//   #232F3E  – navbar bg (this component's wrapper)
//   #FF9900  – active / accent orange
//   #FFB84D  – accent hover
//   white/70 – default link color
// ALL logic, hooks, state, routes 100% unchanged.
// ─────────────────────────────────────────────────────────────

function Navbar() {
  const [menOpen, setMenOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMenOpen(false);
        setWomenOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Desktop nav link classes ───────────────────────────────
  // Active: orange text + orange bottom border (Amazon-style)
  // Hover:  orange text + animated underline grows from left
  const navClass = ({ isActive }) =>
    isActive
      ? "text-[#FF9900] text-xs font-semibold uppercase tracking-widest border-b-2 border-[#FF9900] pb-0.5 transition-colors duration-150"
      : "text-white/75 hover:text-[#FF9900] text-xs font-medium uppercase tracking-widest transition-colors duration-150 relative " +
        "after:absolute after:left-0 after:-bottom-[3px] after:h-[2px] after:w-0 after:bg-[#FF9900] after:transition-all after:duration-200 hover:after:w-full";

  // ── Desktop dropdown link classes ─────────────────────────
  // Hover: soft orange-50 bg + orange text (Myntra/Flipkart feel)
  const dropdownLink =
    "block px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-500 transition-colors duration-150 no-underline tracking-wide";

  // ── Mobile nav link classes ────────────────────────────────
  const mobileNavClass = ({ isActive }) =>
    isActive
      ? "block py-3.5 px-1 text-sm font-semibold uppercase tracking-widest text-[#FF9900] border-b border-white/10"
      : "block py-3.5 px-1 text-sm font-medium uppercase tracking-widest text-white/70 hover:text-[#FF9900] transition-colors duration-150 border-b border-white/10";

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      ref={ref}
      className="relative z-[999] w-full bg-[#232F3E]"
    >
      {/* ════════════════════════════════════════════════════
          DESKTOP NAV  (md and above)
          Centered row of category links.
          Height: h-11 for comfortable click targets.
      ════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center justify-center gap-1 lg:gap-0 px-4 lg:px-6 h-11 max-w-[1400px] mx-auto">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${navClass({ isActive })} px-3 lg:px-4`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `${navClass({ isActive })} px-3 lg:px-4`
          }
        >
          Shop
        </NavLink>

        <NavLink
          to="/collections"
          className={({ isActive }) =>
            `${navClass({ isActive })} px-3 lg:px-4`
          }
        >
          Collections
        </NavLink>

        {/* ── Men dropdown ────────────────────────────────── */}
        <div className="relative px-3 lg:px-4 h-full flex items-center">
          <button
            onClick={() => { setMenOpen((p) => !p); setWomenOpen(false); }}
            className={
              "flex items-center gap-1 text-xs font-medium uppercase tracking-widest cursor-pointer transition-colors duration-150 " +
              (menOpen ? "text-[#FF9900]" : "text-white/75 hover:text-[#FF9900]")
            }
          >
            Men
            <svg
              className={`w-2.5 h-2.5 transition-transform duration-200 ${menOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown panel — white card with soft shadow */}
          {menOpen && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
              {/* Panel header */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Men's Fragrances</p>
              </div>
              <NavLink to="/men/edp"       onClick={() => setMenOpen(false)} className={dropdownLink}>Eau de Parfum</NavLink>
              <NavLink to="/men/edt"       onClick={() => setMenOpen(false)} className={dropdownLink}>Eau de Toilette</NavLink>
              <NavLink to="/men/cologne"   onClick={() => setMenOpen(false)} className={dropdownLink}>Cologne</NavLink>
              <NavLink to="/men/gift-sets" onClick={() => setMenOpen(false)} className={dropdownLink}>Gift Sets</NavLink>
            </div>
          )}
        </div>

        {/* ── Women dropdown ───────────────────────────────── */}
        <div className="relative px-3 lg:px-4 h-full flex items-center">
          <button
            onClick={() => { setWomenOpen((p) => !p); setMenOpen(false); }}
            className={
              "flex items-center gap-1 text-xs font-medium uppercase tracking-widest cursor-pointer transition-colors duration-150 " +
              (womenOpen ? "text-[#FF9900]" : "text-white/75 hover:text-[#FF9900]")
            }
          >
            Women
            <svg
              className={`w-2.5 h-2.5 transition-transform duration-200 ${womenOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown panel */}
          {womenOpen && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Women's Fragrances</p>
              </div>
              <NavLink to="/women/floral"    onClick={() => setWomenOpen(false)} className={dropdownLink}>Floral</NavLink>
              <NavLink to="/women/oriental"  onClick={() => setWomenOpen(false)} className={dropdownLink}>Oriental</NavLink>
              <NavLink to="/women/fresh"     onClick={() => setWomenOpen(false)} className={dropdownLink}>Fresh</NavLink>
              <NavLink to="/women/gift-sets" onClick={() => setWomenOpen(false)} className={dropdownLink}>Gift Sets</NavLink>
            </div>
          )}
        </div>

        {/* ── New Arrivals — promotional badge link ────────── */}
        {/* Uses a fixed fn (not navClass) to always show the badge style */}
        <NavLink
          to="/new-arrivals"
          className={() =>
            "flex items-center gap-1.5 px-3 lg:px-4 text-[#FF9900] hover:text-[#FFB84D] text-xs font-bold uppercase tracking-widest transition-colors duration-150 group"
          }
        >
          {/* "NEW" pill badge */}
          <span className="bg-[#FF9900] group-hover:bg-[#FFB84D] text-[#131921] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full leading-none transition-colors duration-150">
            NEW
          </span>
          Arrivals
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${navClass({ isActive })} px-3 lg:px-4`
          }
        >
          About Us
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${navClass({ isActive })} px-3 lg:px-4`
          }
        >
          Contact Us
        </NavLink>
      </div>

      {/* ════════════════════════════════════════════════════
          MOBILE BAR  (below md)
          Hamburger trigger row.
      ════════════════════════════════════════════════════ */}
      <div className="flex md:hidden items-center justify-between px-4 h-11">
        <span className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em]">
          Browse
        </span>

        {/* Hamburger / X button */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer rounded-lg hover:bg-white/10 transition-colors duration-150"
        >
          <span className={`block h-[2px] w-5 bg-white/80 rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-[2px] w-5 bg-white/80 rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-[2px] w-5 bg-white/80 rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* ════════════════════════════════════════════════════
          MOBILE DRAWER
          Full-width panel below the bar.
          Dark bg, touch-friendly rows (min py-3.5).
      ════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="md:hidden bg-[#131921] border-t border-white/10 px-4 pb-6">

          {/* Top-level links */}
          <NavLink to="/"           onClick={closeMobile} className={mobileNavClass}>Home</NavLink>
          <NavLink to="/shop"       onClick={closeMobile} className={mobileNavClass}>Shop</NavLink>
          <NavLink to="/collections" onClick={closeMobile} className={mobileNavClass}>Collections</NavLink>

          {/* ── Men accordion ─────────────────────────────── */}
          <div className="border-b border-white/10">
            <button
              onClick={() => { setMenOpen((p) => !p); setWomenOpen(false); }}
              className="w-full flex items-center justify-between py-3.5 px-1 text-sm font-medium uppercase tracking-widest text-white/70 hover:text-[#FF9900] transition-colors duration-150 cursor-pointer"
            >
              Men
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${menOpen ? "rotate-180 text-[#FF9900]" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Accordion content — indented, subtle rows */}
            {menOpen && (
              <div className="pb-3 pl-4 flex flex-col">
                <NavLink to="/men/edp"       onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide border-b border-white/5">Eau de Parfum</NavLink>
                <NavLink to="/men/edt"       onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide border-b border-white/5">Eau de Toilette</NavLink>
                <NavLink to="/men/cologne"   onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide border-b border-white/5">Cologne</NavLink>
                <NavLink to="/men/gift-sets" onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide">Gift Sets</NavLink>
              </div>
            )}
          </div>

          {/* ── Women accordion ───────────────────────────── */}
          <div className="border-b border-white/10">
            <button
              onClick={() => { setWomenOpen((p) => !p); setMenOpen(false); }}
              className="w-full flex items-center justify-between py-3.5 px-1 text-sm font-medium uppercase tracking-widest text-white/70 hover:text-[#FF9900] transition-colors duration-150 cursor-pointer"
            >
              Women
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${womenOpen ? "rotate-180 text-[#FF9900]" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {womenOpen && (
              <div className="pb-3 pl-4 flex flex-col">
                <NavLink to="/women/floral"    onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide border-b border-white/5">Floral</NavLink>
                <NavLink to="/women/oriental"  onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide border-b border-white/5">Oriental</NavLink>
                <NavLink to="/women/fresh"     onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide border-b border-white/5">Fresh</NavLink>
                <NavLink to="/women/gift-sets" onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2.5 text-sm text-white/55 hover:text-[#FF9900] transition-colors duration-150 tracking-wide">Gift Sets</NavLink>
              </div>
            )}
          </div>

          {/* New Arrivals — highlighted row */}
          <NavLink
            to="/new-arrivals"
            onClick={closeMobile}
            className={() =>
              "flex items-center gap-2 py-3.5 px-1 text-sm font-bold uppercase tracking-widest text-[#FF9900] hover:text-[#FFB84D] transition-colors duration-150 border-b border-white/10"
            }
          >
            <span className="bg-[#FF9900] text-[#131921] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
              NEW
            </span>
            Arrivals
          </NavLink>

          <NavLink to="/about"   onClick={closeMobile} className={mobileNavClass}>About Us</NavLink>
          <NavLink to="/contact" onClick={closeMobile} className={mobileNavClass}>Contact Us</NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;