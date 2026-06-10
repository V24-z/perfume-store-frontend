import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

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

  const navClass = ({ isActive }) =>
    isActive
      ? "text-white text-xs font-medium uppercase tracking-wide xl:tracking-widest border-b border-white pb-0.5"
      : "text-white/70 hover:text-white text-xs font-medium uppercase tracking-wide xl:tracking-widest transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full";

  const dropdownLink =
    "block px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors tracking-wide no-underline";

  const mobileNavClass = ({ isActive }) =>
    isActive
      ? "block py-3 text-sm font-medium uppercase tracking-widest text-white border-b border-white/10"
      : "block py-3 text-sm font-medium uppercase tracking-widest text-white/60 hover:text-white transition-colors border-b border-white/10";

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      ref={ref}
      className="relative z-[999] w-full backdrop-blur-md bg-white/5 border-b border-white/10"
    >
      {/* ── Desktop nav (md+) ── */}
      <div className="hidden md:flex items-center justify-center  gap-3 md:gap-4 lg:gap-5 xl:gap-7 px-4 lg:px-6 h-10 max-w-7xl mx-auto">

        <NavLink to="/" className={navClass}>Home</NavLink>
        <NavLink to="/shop" className={navClass}>Shop</NavLink>
        <NavLink to="/collections" className={navClass}>Collections</NavLink>

        {/* Men dropdown */}
        <div className="relative">
          <button
            onClick={() => { setMenOpen((p) => !p); setWomenOpen(false); }}
            className="flex items-center gap-1 text-white/70 hover:text-white text-xs font-medium uppercase tracking-wide xl:tracking-widest transition-colors cursor-pointer"
          >
            Men
            <svg className={`w-2.5 h-2.5 transition-transform ${menOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {menOpen && (
            <div className="absolute top-full left-0 mt-2.5 w-44 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden z-50 animate-fadeIn">
              <NavLink to="/men/edp" onClick={() => setMenOpen(false)} className={dropdownLink}>Eau de Parfum</NavLink>
              <NavLink to="/men/edt" onClick={() => setMenOpen(false)} className={dropdownLink}>Eau de Toilette</NavLink>
              <NavLink to="/men/cologne" onClick={() => setMenOpen(false)} className={dropdownLink}>Cologne</NavLink>
              <NavLink to="/men/gift-sets" onClick={() => setMenOpen(false)} className={dropdownLink}>Gift Sets</NavLink>
            </div>
          )}
        </div>

        {/* Women dropdown */}
        <div className="relative">
          <button
            onClick={() => { setWomenOpen((p) => !p); setMenOpen(false); }}
            className="flex items-center gap-1 text-white/70 hover:text-white text-xs font-medium uppercase tracking-wide xl:tracking-widest transition-colors cursor-pointer"
          >
            Women
            <svg className={`w-2.5 h-2.5 transition-transform ${womenOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {womenOpen && (
            <div className="absolute top-full left-0 mt-2.5 w-44 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden z-50 animate-fadeIn">
              <NavLink to="/women/floral" onClick={() => setWomenOpen(false)} className={dropdownLink}>Floral</NavLink>
              <NavLink to="/women/oriental" onClick={() => setWomenOpen(false)} className={dropdownLink}>Oriental</NavLink>
              <NavLink to="/women/fresh" onClick={() => setWomenOpen(false)} className={dropdownLink}>Fresh</NavLink>
              <NavLink to="/women/gift-sets" onClick={() => setWomenOpen(false)} className={dropdownLink}>Gift Sets</NavLink>
            </div>
          )}
        </div>

        <NavLink to="/new-arrivals" className={() => "text-yellow-300 hover:text-yellow-200 text-xs font-semibold uppercase tracking-wide xl:tracking-widest transition-colors"}>
          ✦ New Arrivals
        </NavLink>
        <NavLink to="/about" className={navClass}>About Us</NavLink>
        <NavLink to="/contact" className={navClass}>Contact Us</NavLink>

      </div>

      {/* ── Mobile bar (< md) ── */}
      <div className="flex inset-0 z-[9999] md:hidden items-center justify-between px-4 h-10">
        <span className="text-white/50 text-[10px] uppercase tracking-widest">Menu</span>
        <button
          onClick={() => setMobileOpen((p) => !p)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="w-8  h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className={`block h-px w-5 bg-white/70 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-px w-5 bg-white/70 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-white/70 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1a0533]/98 backdrop-blur-md border-t border-white/10 px-5 pb-5">

          <NavLink to="/" onClick={closeMobile} className={mobileNavClass}>Home</NavLink>
          <NavLink to="/shop" onClick={closeMobile} className={mobileNavClass}>Shop</NavLink>
          <NavLink to="/collections" onClick={closeMobile} className={mobileNavClass}>Collections</NavLink>

          {/* Men accordion */}
          <div className="border-b border-white/10">
            <button
              onClick={() => { setMenOpen((p) => !p); setWomenOpen(false); }}
              className="w-full flex items-center justify-between py-3 text-sm font-medium uppercase tracking-widest text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Men
              <svg className={`w-3 h-3 transition-transform ${menOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {menOpen && (
              <div className="pb-2 pl-3 flex flex-col gap-0.5">
                <NavLink to="/men/edp" onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Eau de Parfum</NavLink>
                <NavLink to="/men/edt" onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Eau de Toilette</NavLink>
                <NavLink to="/men/cologne" onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Cologne</NavLink>
                <NavLink to="/men/gift-sets" onClick={() => { setMenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Gift Sets</NavLink>
              </div>
            )}
          </div>

          {/* Women accordion */}
          <div className="border-b border-white/10">
            <button
              onClick={() => { setWomenOpen((p) => !p); setMenOpen(false); }}
              className="w-full flex items-center justify-between py-3 text-sm font-medium uppercase tracking-widest text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Women
              <svg className={`w-3 h-3 transition-transform ${womenOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {womenOpen && (
              <div className="pb-2 pl-3 flex flex-col gap-0.5">
                <NavLink to="/women/floral" onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Floral</NavLink>
                <NavLink to="/women/oriental" onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Oriental</NavLink>
                <NavLink to="/women/fresh" onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Fresh</NavLink>
                <NavLink to="/women/gift-sets" onClick={() => { setWomenOpen(false); closeMobile(); }} className="block py-2 text-xs text-white/50 hover:text-white transition-colors tracking-wide">Gift Sets</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/new-arrivals" onClick={closeMobile} className={() => "block py-3 text-sm font-semibold uppercase tracking-widest text-yellow-300 hover:text-yellow-200 transition-colors border-b border-white/10"}>
            ✦ New Arrivals
          </NavLink>
          <NavLink to="/about" onClick={closeMobile} className={mobileNavClass}>About Us</NavLink>
          <NavLink to="/contact" onClick={closeMobile} className={mobileNavClass}>Contact Us</NavLink>

        </div>
      )}
    </nav>
  );
}

export default Navbar;
