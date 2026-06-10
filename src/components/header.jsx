import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import useCart from "../context/useCart";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom"; // ✅ import this
import Navbar from "./Navbar";

function Header() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 }); // ✅ track position
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null); // ✅ ref on the button
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (!dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    }
    setDropdownOpen((p) => !p);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // Dropdown rendered via portal — fully outside header stacking context
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
        }}
        className="w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn"
      >
        <div className="flex flex-col items-center gap-1 px-4 py-4 bg-gray-50 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-white text-xl font-bold mb-1">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
          {user?.name && (
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          )}
          {user?.email && <p className="text-xs text-gray-500">{user.email}</p>}
        </div>
        <div className="py-1">
          <Link
            to="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition no-underline"
          >
            👤 View profile
          </Link>
          <Link
            to="/orders"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition no-underline"
          >
            📦 My orders
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition no-underline"
          >
            🤍 Wishlist
          </Link>
        </div>
        <div className="border-t border-gray-100 py-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            → Log out
          </button>
        </div>
      </div>,
      document.body, // renders directly into <body>, above everything
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
      <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-[#1a0533] via-[#2d0a4e] to-[#4a1060]">
        {user?.registerd && (
          <div className="flex w-full bg-black/20 py-1.5 justify-center items-center gap-x-3 flex-wrap px-4">
            <p className="text-[11px] text-gray-300">
              Welcome{" "}
              <span className="text-gray-300 font-medium">
                {user.name} !!
              </span>{" "}
            </p>{" "}
            <p className="text-[11px] px-1 text-gray-300">
              Joined on:{" "}
              <span className="text-yellow-300 font-medium">
                {formatDate(user.registerd)}
              </span>
            </p>
          </div>
        )}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 max-w-7xl mx-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-10 h-10 bg-yellow-400/20 border border-yellow-400/40 rounded-xl flex flex-col items-center justify-center">
                <span className="text-yellow-300 text-lg leading-none">◈</span>
              </div>
              <div>
                <p className="text-white font-bold text-base tracking-[0.12em] leading-tight m-0">
                  LUMIÈRE
                </p>
                <p className="text-yellow-400/70 text-[9px] tracking-[0.22em] leading-tight m-0">
                  PARFUM
                </p>
              </div>
            </Link>

            {/* Search bar */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-4 py-2 cursor-pointer transition-all w-56 lg:w-72">
              <svg
                className="w-3.5 h-3.5 text-white/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-white/40 text-xs tracking-wide">
                Search fragrances...
              </span>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Wishlist */}
              <button className="relative w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer">
                <svg
                  className="w-4 h-4"
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
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Cart */}
              <Link to={"/cart"}>
                <button className="relative w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer">
                  <svg
                    className="w-4 h-4"
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
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                     {cartItems.length}
                  </span>
                </button>
              </Link>

              {/* Auth */}
              {!user ? (
                <Link
                  to="/signup"
                  className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-xs font-bold px-5 py-2 rounded-full tracking-wide transition no-underline"
                >
                  Sign Up
                </Link>
              ) : (
                // ✅ Only the button here — dropdown is portaled to body
                <button
                  ref={buttonRef}
                  onClick={handleToggle}
                  className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-sm hover:bg-white/30 transition cursor-pointer"
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

      {/* ✅ Portal dropdown renders here, outside header */}
      {dropdown}
    </>
  );
}

export default Header;
