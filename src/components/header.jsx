import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import useCart from "../context/useCart";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCartAnimation  from "../context/usecartAnimation";
import Navbar from "./Navbar";

function Header() {
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [cartPos, setCartPos] = useState({
    top: 0,
    right: 0,
  });
  const { setCartPosition } = useCartAnimation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.products?.price || 0) * (item.quantity || 0),
    0,
  );
  useEffect(() => {
    const handler = (e) => {
      const clickedProfile =
        dropdownRef.current?.contains(e.target) ||
        buttonRef.current?.contains(e.target);

      const clickedCart =
        cartRef.current?.contains(e.target) ||
        cartButtonRef.current?.contains(e.target);

      if (!clickedProfile) {
        setDropdownOpen(false);
      }

      if (!clickedCart) {
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
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
      document.body,
    );

  const handleCartToggle = () => {
    if (!cartOpen && cartButtonRef.current) {
      const rect = cartButtonRef.current.getBoundingClientRect();

      setCartPos({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
       setCartPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
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
          initial={{
            opacity: 0,
            y: -10,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.95,
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: cartPos.top,
            right: cartPos.right,
            zIndex: 999999,
          }}
          className="w-[380px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* move your existing cart content here */}
         
                <div className="p-4 border-b">
                  <h3 className="font-bold text-lg">Shopping Cart</h3>

                  <p className="text-sm text-gray-500">
                    {cartItems.length} item(s)
                  </p>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-3">🛒</div>

                    <p className="text-gray-500">Your cart is empty</p>

                    <Link
                      to="/"
                      className="
                inline-block
                mt-4
                bg-black
                text-white
                px-5
                py-2
                rounded-lg
              "
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="max-h-[350px] overflow-y-auto">
                      {cartItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="
                      flex
                      gap-3
                      p-4
                      border-b
                    "
                        >
                          <img
                            src={item.products?.image_url}
                            alt=""
                            className="
                        w-16
                        h-16
                        rounded-lg
                        object-cover
                      "
                          />

                          <div className="flex-1">
                            <h4
                              className="
                        text-sm
                        font-medium
                        line-clamp-1
                      "
                            >
                              {item.products?.name}
                            </h4>

                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {item.quantity}
                            </p>

                            <p className="font-semibold mt-1">
                              ₹{(item.products?.price || 0) * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FREE SHIPPING */}
                    <div className="px-4 pt-4">
                      {subtotal < 1999 ? (
                        <>
                          <p className="text-xs text-gray-600 mb-2">
                            Add ₹{1999 - subtotal} more for FREE shipping
                          </p>

                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: `${Math.min(
                                  (subtotal / 1999) * 100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-green-600 text-sm font-medium">
                          🎉 Free Shipping Unlocked
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t mt-4">
                      <div className="flex justify-between font-semibold mb-4">
                        <span>Subtotal</span>

                        <span>₹{subtotal}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cart"
                          onClick={() => setCartOpen(false)}
                          className="
                    text-center
                    border
                    py-2.5
                    rounded-lg
                    font-medium
                  "
                        >
                          View Cart
                        </Link>

                        <Link
                          to="/checkout"
                          onClick={() => setCartOpen(false)}
                          className="
                    text-center
                    bg-black
                    text-white
                    py-2.5
                    rounded-lg
                    font-medium
                  "
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

        {/* Main bar */}
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
                <span style={{ color: "#fde047", fontSize: 18, lineHeight: 1 }}>
                  ◈
                </span>
              </div>
              <div>
                <p
                  className="font-bold text-base m-0"
                  style={{
                    color: "#fff",
                    letterSpacing: "0.12em",
                    lineHeight: 1.2,
                  }}
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
            <div
              className="hidden lg:flex items-center gap-2 rounded-full px-4 py-2 cursor-pointer transition-all w-56 lg:w-72"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.20)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
              }
            >
              <svg
                className="w-3.5 h-3.5"
                style={{ color: "rgba(255,255,255,0.50)" }}
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
              <span
                style={{
                  color: "rgba(255,255,255,0.40)",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                }}
              >
                Search fragrances...
              </span>
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
                <span
                  className="absolute -top-1 -right-1 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#f43f5e", fontSize: 9 }}
                >
                  2
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

                  <span
                    className="absolute -top-1 -right-1 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      background: "#f43f5e",
                      fontSize: 9,
                    }}
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fde047")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#facc15")
                  }
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.30)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.20)")
                  }
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

      {/* Portal dropdown */}
      {dropdown}
      {cartDropdown}
    </>
  );
}

export default Header;
