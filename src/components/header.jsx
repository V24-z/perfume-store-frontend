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
import { ShoppingBag, Heart, User, LogOut, Package, UserCheck, X } from "lucide-react";

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
        className="w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn"
      >
        {/* Avatar + info */}
        <div className="flex flex-col items-center gap-1.5 px-4 py-4 bg-slate-50 border-b border-slate-100">
          <div className="w-11 h-11 rounded-full bg-[#1a0533] flex items-center justify-center text-white text-base font-bold shadow-sm">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="text-center w-full min-w-0">
            {user?.name && (
              <p className="text-xs font-bold text-slate-800 truncate">
                {user.name}
              </p>
            )}
            {user?.email && (
              <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="p-1.5 space-y-0.5">
          <Link
            to="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition no-underline"
          >
            <User size={14} className="text-slate-400" /> View profile
          </Link>
          <Link
            to="/order/"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition no-underline"
          >
            <Package size={14} className="text-slate-400" /> My orders
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition no-underline"
          >
            <Heart size={14} className="text-slate-400" /> Wishlist
          </Link>
        </div>

        <div className="border-t border-slate-100 p-1.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border-0 bg-transparent transition cursor-pointer text-left"
          >
            <LogOut size={14} /> Log out
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
          className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Shopping Bag</h3>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">{cartItems.length} item(s) selected</p>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition rounded-full border-0 bg-transparent hover:bg-slate-50 cursor-pointer w-7 h-7 flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 shadow-inner">
                <ShoppingBag size={20} />
              </div>
              <p className="text-slate-400 text-xs font-semibold">Your cart is empty</p>
              <Link
                to="/"
                onClick={() => setCartOpen(false)}
                className="inline-block mt-4 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl no-underline hover:bg-slate-800 transition-colors shadow-sm"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="max-h-[220px] sm:max-h-[260px] overflow-y-auto divide-y divide-slate-50 px-1">
                {cartItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex gap-3 px-3 py-3 hover:bg-slate-50/40 rounded-xl transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/40 shadow-inner">
                      <img
                        src={item.products?.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.products?.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] font-medium text-slate-400">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-extrabold text-slate-900">
                          ₹{new Intl.NumberFormat("en-IN").format((item.products?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length > 5 && (
                  <p className="text-center text-[10px] font-bold tracking-wider text-slate-400 bg-slate-50/50 py-2.5 rounded-xl my-1 uppercase">
                    +{cartItems.length - 5} more items in bag
                  </p>
                )}
              </div>

              {/* Free shipping bar */}
              <div className="px-4 pt-3.5 pb-2 border-t border-slate-100">
                {subtotal < 1999 ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide">
                      <p className="text-slate-400">
                        ₹{new Intl.NumberFormat("en-IN").format(1999 - subtotal)} away from free shipping
                      </p>
                      <p className="text-violet-600">
                        {Math.round((subtotal / 1999) * 100)}%
                      </p>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min((subtotal / 1999) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg w-full">
                    <span>🎉</span> Free Shipping Unlocked!
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 mt-2">
                <div className="flex justify-between items-center px-1 mb-2.5">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Subtotal</span>
                  <span className="text-base font-black text-slate-900">₹{new Intl.NumberFormat("en-IN").format(subtotal)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="text-center bg-white border border-slate-200/80 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition no-underline shadow-sm"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="text-center bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition no-underline shadow-sm"
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
        className="w-full sticky top-0 z-50 shadow-md"
        style={{
          background: "linear-gradient(to right, #1a0533, #2d0a4e, #4a1060)",
        }}
      >
        {/* Welcome bar */}
        {user?.registerd && (
          <div
            className="flex w-full py-2 justify-center items-center gap-x-4 flex-wrap px-4 border-b border-white/5 font-medium tracking-wide"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              Welcome back,{" "}
              <span className="font-bold text-white">
                {user.name}
              </span>
            </p>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              Maison Member since:{" "}
              <span className="font-bold text-[#fde047]">
                {formatDate(user.registerd)}
              </span>
            </p>
          </div>
        )}

        {/* Main bar */}
        <div
          style={{
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 max-w-7xl mx-auto gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
              <div
                className="w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-transform group-hover:scale-105 shadow-inner"
                style={{
                  background: "rgba(253,224,71,0.15)",
                  border: "1px solid rgba(253,224,71,0.35)",
                }}
              >
                <span style={{ color: "#fde047", fontSize: 16, lineHeight: 1 }} className="animate-pulse">◈</span>
              </div>
              <div className="hidden sm:block">
                <p
                  className="font-black text-base m-0 tracking-[0.14em]"
                  style={{ color: "#fff", lineHeight: 1.1 }}
                >
                  LUMIÈRE
                </p>
                <p
                  className="m-0 font-medium"
                  style={{
                    color: "rgba(253,224,71,0.85)",
                    fontSize: 8,
                    letterSpacing: "0.26em",
                    lineHeight: 1.1,
                    marginTop: "2px"
                  }}
                >
                  PARFUM
                </p>
              </div>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-2 sm:mx-6">
              <SearchBar />
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative w-9 h-9 rounded-full flex items-center justify-center border transition-all text-white/80 hover:text-white hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                <Heart size={16} />
                {wishlistItems.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                    style={{ background: "#f43f5e", fontSize: 8 }}
                  >
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <div className="relative">
                <button
                  ref={cartButtonRef}
                  onClick={handleCartToggle}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center border transition-all text-white/80 hover:text-white hover:scale-105 active:scale-95 bg-transparent cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <ShoppingBag size={16} />
                  {cartItems.length > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                      style={{ background: "#f43f5e", fontSize: 8 }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Auth */}
              {!user ? (
                <Link
                  to="/signup"
                  className="text-xs font-bold px-4 sm:px-5 py-2 rounded-xl tracking-wide transition-all shadow-sm no-underline hover:scale-105 active:scale-95 shrink-0 border-0"
                  style={{ background: "#facc15", color: "#3b0764" }}
                >
                  Sign Up
                </Link>
              ) : (
                <button
                  ref={buttonRef}
                  onClick={handleToggle}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.35)",
                  }}
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