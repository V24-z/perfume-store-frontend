import { NavLink } from "react-router-dom";
import { useState, useRef } from "react";

function Navbar() {
 
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef(null);

 

  const navClass = ({ isActive }) =>
    isActive
      ? "text-white text-xs font-medium uppercase tracking-wide xl:tracking-widest border-b border-white pb-0.5"
      : "text-white/70 hover:text-white text-xs font-medium uppercase tracking-wide xl:tracking-widest transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full";

  
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

        {/* Men dropdown */}
       

        {/* Women dropdown */}
       

       
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

          {/* Men accordion */}
         

          {/* Women accordion */}
         

         
          <NavLink to="/about" onClick={closeMobile} className={mobileNavClass}>About Us</NavLink>
          <NavLink to="/contact" onClick={closeMobile} className={mobileNavClass}>Contact Us</NavLink>

        </div>
      )}
    </nav>
  );
}

export default Navbar;
