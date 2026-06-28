import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import useCart from "../context/useCart";
import SearchBar from "../components/seachBar";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCartAnimation from "../context/usecartAnimation";
import useWishlist from "../context/useWhishlist";
import Navbar from "./Navbar";

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
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const updateCartPosition = () => {
      if (!cartButtonRef.current) return;
      const rect = cartButtonRef.current.getBoundingClientRect();
      setCartPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
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

  useEffect(() => {
    const handler = (e) => {
      if (
        !dropdownRef.current?.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
      ) setDropdownOpen(false);
      if (
        !cartRef.current?.contains(e.target) &&
        !cartButtonRef.current?.contains(e.target)
      ) setCartOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 480;
      setDropdownPos({
        top: rect.bottom + 8,
        right: isMobile
          ? Math.max(8, window.innerWidth - rect.right)
          : window.innerWidth - rect.right,
      });
    }
    setDropdownOpen((p) => !p);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // ── PROFILE DROPDOWN ──────────────────────────────────────────
  const dropdown =
    dropdownOpen &&
    createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: "fixed",
          top: dropdownPos.top,
          right: dropdownPos.right,
          zIndex: 99999,
          maxWidth: "calc(100vw - 16px)",
        }}
        className="w-48 sm:w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn"
      >
        {/* Avatar + info */}
        <div className="flex flex-col items-center gap-1 px-3 py-3 bg-gray-50 border-b border-gray-100">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-700 flex items-center justify-center text-white text-lg sm:text-xl font-bold">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
          {user?.name && (
            <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 truncate w-full text-center">
              {user.name}
            </p>
          )}
          {user?.email && (
            <p className="text-[10px] sm:text-xs text-gray-500 truncate w-full text-center px-1">
              {user.email}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="py-0.5">
          <Link
            to="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition no-underline"
          >
            👤 View profile
          </Link>
          <Link
            to="/order"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition no-underline"
          >
            📦 My orders
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition no-underline"
          >
            🤍 Wishlist
          </Link>
        </div>

        <div className="border-t border-gray-100 py-0.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            → Log out
          </button>
        </div>
      </div>,
      document.body,
    );

  // ── CART DROPDOWN ──────────────────────────────────────────────
  const handleCartToggle = () => {
    if (!cartOpen && cartButtonRef.current) {
      const rect = cartButtonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 480;
      setCartPos({
        top: rect.bottom + 8,
        right: isMobile ? 8 : window.innerWidth - rect.right,
      });
    }
    setCartOpen((prev) => !prev);
  };

  const cartDropdown =
    cartOpen &&
    createPortal(
      <AnimatePresence>
        <motion.div
          ref={cartRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed",
            top: cartPos.top,
            right: cartPos.right,
            zIndex: 999999,
            width: window.innerWidth < 480 ? "calc(100vw - 16px)" : "320px",
            maxWidth: "calc(100vw - 16px)",
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b">
            <div>
              <h3 className="font-bold text-sm leading-tight">Shopping Cart</h3>
              <p className="text-[11px] text-gray-400">{cartItems.length} item(s)</p>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition text-base leading-none cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="text-3xl mb-2">🛒</div>
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <Link
                to="/"
                onClick={() => setCartOpen(false)}
                className="inline-block mt-3 bg-black text-white px-4 py-1.5 rounded-lg text-xs font-medium no-underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="max-h-[200px] sm:max-h-[240px] overflow-y-auto divide-y divide-gray-50">
                {cartItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex gap-2.5 px-3 py-2.5">
                    <img
                      src={item.products?.image_url}
                      alt=""
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1 text-gray-800">
                        {item.products?.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 mt-0.5">
                        ₹{(item.products?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {cartItems.length > 5 && (
                  <p className="text-center text-[11px] text-gray-400 py-2">
                    +{cartItems.length - 5} more items
                  </p>
                )}
              </div>

              {/* Free shipping bar */}
              <div className="px-3 pt-2 pb-1">
                {subtotal < 1999 ? (
                  <>
                    <div className="flex justify-between mb-1">
                      <p className="text-[11px] text-gray-500">
                        ₹{1999 - subtotal} away from free shipping
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {Math.round((subtotal / 1999) * 100)}%
                      </p>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 1999) * 100, 100)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-green-600 text-xs font-medium">
                    🎉 Free Shipping Unlocked!
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-3 py-2.5 bg-gray-50 border-t mt-1.5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs text-gray-600 font-medium">Subtotal</span>
                  <span className="text-sm font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="text-center border border-gray-300 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition no-underline"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="text-center bg-black text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-900 transition no-underline"
                  >
                    Checkout
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
      <header
        className="w-full sticky top-0 z-50"
        style={{
          background: "linear-gradient(to right, #1a0533, #2d0a4e, #4a1060)",
        }}
      >
        {/* Welcome bar */}
        {user?.registerd && (
          <div
            className="flex w-full py-1.5 justify-center items-center gap-x-3 flex-wrap px-4"
            style={{ background: "rgba(0,0,0,0.2)" }}
          >
            <p className="text-xs" style={{ color: "#d1d5db" }}>
              Welcome{" "}
              <span className="font-medium" style={{ color: "#d1d5db" }}>
                {user.name} !!
              </span>
            </p>
            <p className="text-xs px-1" style={{ color: "#d1d5db" }}>
              Joined on:{" "}
              <span className="font-medium" style={{ color: "#fde047" }}>
                {formatDate(user.registerd)}
              </span>
            </p>
          </div>
        )}

        {/* Main bar — unchanged */}
        <div
          style={{
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 max-w-7xl mx-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div
                className="w-10 h-10 rounded-xl flex flex-col items-center justify-center"
                style={{
                  background: "rgba(250,204,21,0.20)",
                  border: "1px solid rgba(250,204,21,0.40)",
                }}
              >
                <span style={{ color: "#fde047", fontSize: 18, lineHeight: 1 }}>◈</span>
              </div>
              <div>
                <p
                  className="font-bold text-base m-0"
                  style={{ color: "#fff", letterSpacing: "0.12em", lineHeight: 1.2 }}
                >
                  LUMIÈRE
                </p>
                <p
                  className="m-0"
                  style={{
                    color: "rgba(250,204,21,0.70)",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    lineHeight: 1.2,
                  }}
                >
                  PARFUM
                </p>
              </div>
            </Link>

            {/* Search bar */}
            <div>
              <SearchBar />
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Wishlist */}
              <button
                className="relative w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  color: "rgba(255,255,255,0.80)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.20)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.80)";
                }}
              >
                <Link to="/wishlist" className="w-full h-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                </Link>
                <span
                  className="absolute -top-1 -right-1 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#f43f5e", fontSize: 9 }}
                >
                  {wishlistItems.length}
                </span>
              </button>

              {/* Cart */}
              <div className="relative">
                <button
                  ref={cartButtonRef}
                  onClick={handleCartToggle}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.20)",
                    color: "rgba(255,255,255,0.80)",
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
                  </svg>
                  <span
                    className="absolute -top-1 -right-1 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "#f43f5e", fontSize: 9 }}
                  >
                    {cartItems.length}
                  </span>
                </button>
              </div>

              {/* Auth */}
              {!user ? (
                <Link
                  to="/signup"
                  className="text-xs font-bold px-5 py-2 rounded-full tracking-wide transition no-underline"
                  style={{ background: "#facc15", color: "#3b0764" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fde047")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#facc15")}
                >
                  Sign Up
                </Link>
              ) : (
                <button
                  ref={buttonRef}
                  onClick={handleToggle}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm transition cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.20)",
                    border: "2px solid rgba(255,255,255,0.40)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.30)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
                >
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navbar strip */}
        <Navbar className="relative z-50" />
      </header>

      {/* Portal dropdowns */}
      {dropdown}
      {cartDropdown}
    </>
  );
}

export default Header;