import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import useCart from "../context/useCart";
import SearchBar from "../components/seachBar";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCartAnimation from "../context/usecartAnimation";
import Navbar from "./Navbar";

// ─────────────────────────────────────────────────────────────
// DESIGN SYSTEM (all logic unchanged; only UI improved)
// Palette: Amazon-inspired dark top bar + crisp white main bar
//   #131921  – deep navy/black top strip
//   #232F3E  – secondary bar / hover
//   #FF9900  – prime amber accent
//   #FFB84D  – accent hover
//   #EF4444  – badge/danger red
//   #22C55E  – free-shipping success green
// ─────────────────────────────────────────────────────────────

function Header() {
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [cartPos, setCartPos] = useState({ top: 0, right: 0 });
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { setCartPosition } = useCartAnimation();

  // ── Save cart icon position (logic unchanged) ──────────────
  useEffect(() => {
    const updateCartPosition = () => {
      if (!cartButtonRef.current) return;
      const rect = cartButtonRef.current.getBoundingClientRect();
      setCartPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    };
    updateCartPosition();
    window.addEventListener("resize", updateCartPosition);
    window.addEventListener("scroll", updateCartPosition);
    return () => {
      window.removeEventListener("resize", updateCartPosition);
      window.removeEventListener("scroll", updateCartPosition);
    };
  }, [setCartPosition]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.products?.price || 0) * (item.quantity || 0),
    0,
  );

  // ── Outside-click handler (logic unchanged) ────────────────
  useEffect(() => {
    const handler = (e) => {
      const clickedProfile =
        dropdownRef.current?.contains(e.target) || buttonRef.current?.contains(e.target);
      const clickedCart =
        cartRef.current?.contains(e.target) || cartButtonRef.current?.contains(e.target);
      if (!clickedProfile) setDropdownOpen(false);
      if (!clickedCart) setCartOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Profile dropdown toggle (logic unchanged) ──────────────
  const handleToggle = () => {
    if (!dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
    }
    setDropdownOpen((p) => !p);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // ── Profile dropdown portal (UI redesigned) ───────────────
  const dropdown =
    dropdownOpen &&
    createPortal(
      <div
        ref={dropdownRef}
        style={{ position: "fixed", top: dropdownPos.top, right: dropdownPos.right, zIndex: 99999 }}
        // UI: wider card, stronger shadow, refined structure
        className="w-60 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden"
      >
        {/* Avatar section */}
        <div className="flex flex-col items-center gap-1 px-5 py-5 bg-gradient-to-br from-[#131921] to-[#232F3E]">
          <div className="w-14 h-14 rounded-full bg-[#FF9900] flex items-center justify-center text-[#131921] text-2xl font-extrabold mb-1 ring-4 ring-white/20">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
          {user?.name && (
            <p className="text-sm font-semibold text-white tracking-wide">{user.name}</p>
          )}
          {user?.email && (
            <p className="text-xs text-white/50 truncate max-w-[180px]">{user.email}</p>
          )}
        </div>

        {/* Menu items */}
        <div className="py-1.5">
          <Link
            to="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#FF9900] transition-colors duration-150 no-underline font-medium"
          >
            <span className="text-base">👤</span> View Profile
          </Link>
          <Link
            to="/order"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#FF9900] transition-colors duration-150 no-underline font-medium"
          >
            <span className="text-base">📦</span> My Orders
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#FF9900] transition-colors duration-150 no-underline font-medium"
          >
            <span className="text-base">🤍</span> Wishlist
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-100 py-1.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer font-semibold"
          >
            <span>→</span> Log Out
          </button>
        </div>
      </div>,
      document.body,
    );

  // ── Cart toggle (logic unchanged) ─────────────────────────
  const handleCartToggle = () => {
    if (!cartOpen && cartButtonRef.current) {
      const rect = cartButtonRef.current.getBoundingClientRect();
      setCartPos({ top: rect.bottom + 12, right: window.innerWidth - rect.right });
    }
    setCartOpen((prev) => !prev);
  };

  // ── Cart dropdown portal (UI redesigned) ──────────────────
  const cartDropdown =
    cartOpen &&
    createPortal(
      <AnimatePresence>
        <motion.div
          ref={cartRef}
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          style={{ position: "fixed", top: cartPos.top, right: cartPos.right, zIndex: 999999 }}
          // UI: premium mini-cart card
          className="w-[400px] max-w-[95vw] bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden"
        >
          {/* Cart header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#131921]">
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Shopping Cart</h3>
              <p className="text-xs text-white/50 mt-0.5">{cartItems.length} item(s)</p>
            </div>
            <svg className="w-5 h-5 text-[#FF9900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
            </svg>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-500 font-medium mb-1">Your cart is empty</p>
              <p className="text-xs text-gray-400 mb-5">Add items to get started</p>
              <Link
                to="/"
                className="inline-block bg-[#FF9900] hover:bg-[#FFB84D] text-[#131921] font-bold px-6 py-2.5 rounded-full text-sm transition-colors duration-150 no-underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50">
                {cartItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex gap-3 p-4 hover:bg-gray-50 transition-colors duration-100">
                    <img
                      src={item.products?.image_url}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.products?.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#131921] mt-1">
                        ₹{(item.products?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free shipping bar */}
              <div className="px-5 pt-4 pb-2">
                {subtotal < 1999 ? (
                  <>
                    <p className="text-xs text-gray-500 mb-2">
                      Add{" "}
                      <span className="font-bold text-[#131921]">₹{1999 - subtotal}</span>{" "}
                      more for <span className="text-green-600 font-semibold">FREE shipping</span>
                    </p>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 1999) * 100, 100)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-green-600 text-sm font-semibold flex items-center gap-1.5">
                    <span>🎉</span> Free Shipping Unlocked!
                  </p>
                )}
              </div>

              {/* Subtotal + CTAs */}
              <div className="px-5 pt-3 pb-5 bg-gray-50 border-t border-gray-100 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                  <span className="text-xl font-extrabold text-[#131921]">₹{subtotal}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="text-center border-2 border-gray-200 text-gray-700 hover:border-[#131921] hover:text-[#131921] py-2.5 rounded-xl font-semibold text-sm transition-colors duration-150 no-underline"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="text-center bg-[#FF9900] hover:bg-[#FFB84D] text-[#131921] py-2.5 rounded-xl font-bold text-sm transition-colors duration-150 no-underline"
                  >
                    Checkout →
                  </Link>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>,
      document.body,
    );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HEADER SHELL
          – Sticky, full-width, 3-layer structure:
            1. Welcome strip  (dark, ultra-thin)
            2. Main bar       (dark premium, logo+search+icons)
            3. Navbar strip   (slightly lighter)
      ══════════════════════════════════════════════════════ */}
      <header className="w-full sticky top-0 z-50 shadow-lg">

        {/* ── Layer 1: Welcome strip ─────────────────────────
            Shown only when user is registered.
            Minimal, high-contrast, small type.
        ───────────────────────────────────────────────────── */}
        {user?.registerd && (
          <div className="bg-[#0f1923] flex items-center justify-center gap-x-4 flex-wrap px-4 py-1.5">
            <p className="text-xs text-gray-400">
              Welcome back,{" "}
              <span className="text-white font-semibold">{user.name}</span>
            </p>
            <span className="text-gray-600 hidden sm:inline">·</span>
            <p className="text-xs text-gray-400 hidden sm:block">
              Member since:{" "}
              <span className="text-[#FF9900] font-medium">{formatDate(user.registerd)}</span>
            </p>
          </div>
        )}

        {/* ── Layer 2: Main bar ──────────────────────────────
            Dark Amazon-inspired bar.
            Layout: [Logo] [────── SearchBar ──────] [Icons]
            On mobile: logo shrinks, search stays prominent.
        ───────────────────────────────────────────────────── */}
        <div className="bg-[#131921]">
          <div className="max-w-[1400px] mx-auto flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-3">

            {/* Logo ─────────────────────────────────────────
                "LUMIÈRE / PARFUM" — premium wordmark.
                Gold diamond icon + white logotype.
            ────────────────────────────────────────────────*/}
            <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0 group">
              {/* Icon badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#FF9900]/20 border border-[#FF9900]/40 group-hover:bg-[#FF9900]/30 transition-colors duration-200">
                <span className="text-[#FF9900] text-lg sm:text-xl leading-none select-none">◈</span>
              </div>
              {/* Wordmark – hidden on very small screens to give search more room */}
              <div className="hidden sm:block">
                <p className="font-extrabold text-sm sm:text-base text-white tracking-[0.14em] leading-tight m-0">
                  LUMIÈRE
                </p>
                <p className="text-[#FF9900]/70 text-[8px] sm:text-[9px] tracking-[0.24em] leading-tight m-0 font-medium">
                  PARFUM
                </p>
              </div>
            </Link>

            {/* Search bar ───────────────────────────────────
                Most prominent element — flex-1 so it expands
                to fill all available space between logo and icons.
            ────────────────────────────────────────────────*/}
            <div className="flex-1 min-w-0">
              <SearchBar />
            </div>

            {/* Right icon cluster ───────────────────────────
                Wishlist · Cart · Auth CTA
                Tight gap on mobile, more breathing room on sm+
            ────────────────────────────────────────────────*/}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

              {/* Wishlist icon button */}
              <button
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                           text-white/70 hover:text-white
                           bg-white/5 hover:bg-white/15
                           border border-white/10 hover:border-white/30
                           transition-all duration-200 cursor-pointer"
                aria-label="Wishlist"
              >
                <svg
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {/* Badge */}
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  2
                </span>
              </button>

              {/* Cart icon button */}
              <button
                ref={cartButtonRef}
                onClick={handleCartToggle}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                           text-white/70 hover:text-white
                           bg-white/5 hover:bg-white/15
                           border border-white/10 hover:border-white/30
                           transition-all duration-200 cursor-pointer"
                aria-label="Cart"
              >
                <svg
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z"
                  />
                </svg>
                {/* Cart count badge */}
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartItems.length}
                </span>
              </button>

              {/* Auth: Sign Up CTA or Avatar */}
              {!user ? (
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex items-center text-xs font-bold px-4 py-2 rounded-full
                             bg-[#FF9900] hover:bg-[#FFB84D] text-[#131921]
                             transition-colors duration-200 no-underline whitespace-nowrap tracking-wide"
                >
                  Sign Up
                </Link>
              ) : (
                <button
                  ref={buttonRef}
                  onClick={handleToggle}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             bg-[#FF9900] hover:bg-[#FFB84D]
                             text-[#131921] font-extrabold text-sm
                             transition-colors duration-200 cursor-pointer
                             ring-2 ring-[#FF9900]/30 hover:ring-[#FFB84D]/50"
                  aria-label="Account"
                >
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Layer 3: Navbar strip ─────────────────────────
            Slightly lighter than the main bar.
            Navbar component handles its own content.
        ───────────────────────────────────────────────────── */}
        <div className="bg-[#232F3E]">
          <Navbar className="relative z-50" />
        </div>
      </header>

      {/* Portals (logic untouched) */}
      {dropdown}
      {cartDropdown}
    </>
  );
}

export default Header;