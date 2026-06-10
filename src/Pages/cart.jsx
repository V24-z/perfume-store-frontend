import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  Package,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import useCart from "../context/useCart";

// ─── animation variants ───────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ─── sub-components ───────────────────────────────────────────────────────────

function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  const subtotal = item.price * item.quantity;
  return (
    <motion.div
      layout
      variants={itemVariants}
      exit="exit"
      whileHover={{ y: -2 }}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      {/* gold accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-[#b8922a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex gap-4 p-4 sm:p-5">
        {/* Product image */}
        <div className="relative flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/200x240/f9f9f9/D4AF37?text=${encodeURIComponent(item.name?.[0] ?? "?")}`;
            }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {item.brand && (
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.12em] uppercase text-[#D4AF37] mb-0.5">
                  {item.brand}
                </p>
              )}
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug truncate">
                {item.name}
              </h3>
              {item.fragrance_type && (
                <p className="text-xs text-gray-400 mt-0.5">{item.fragrance_type}</p>
              )}
            </div>
            {/* Remove */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(item.id)}
              aria-label="Remove item"
              className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors duration-200"
            >
              <Trash2 size={13} />
            </motion.button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Qty selector */}
            <div className="flex items-center gap-1 border border-gray-100 rounded-xl bg-gray-50 p-1">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onDecrease(item.id)}
                aria-label="Decrease quantity"
                className="w-6 h-6 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-[#D4AF37] transition-colors"
              >
                <Minus size={10} />
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={item.quantity}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  className="w-7 text-center text-sm font-semibold text-gray-800 tabular-nums"
                >
                  {item.quantity}
                </motion.span>
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onIncrease(item.id)}
                aria-label="Increase quantity"
                className="w-6 h-6 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-[#D4AF37] transition-colors"
              >
                <Plus size={10} />
              </motion.button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-xs text-gray-400 leading-none mb-0.5">
                ₹{fmt(item.price)} × {item.quantity}
              </p>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                ₹{fmt(subtotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OrderSummary({ subtotal, promoCode, setPromoCode, promoApplied, onApplyPromo }) {
  const shipping = subtotal > 1999 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const grand = subtotal + shipping + tax - discount;

  const rows = [
    { label: "Subtotal", value: `₹${fmt(subtotal)}` },
    { label: "Shipping", value: shipping === 0 ? "Free" : `₹${fmt(shipping)}`, accent: shipping === 0 },
    { label: "GST (18%)", value: `₹${fmt(tax)}` },
    ...(discount > 0 ? [{ label: "Promo (10%)", value: `-₹${fmt(discount)}`, green: true }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-base font-bold text-gray-900 tracking-wide">Order Summary</h2>
      </div>

      <div className="p-5 space-y-5">
        {/* Line items */}
        <div className="space-y-3">
          {rows.map(({ label, value, accent, green }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span
                className={`font-semibold ${
                  green ? "text-green-600" : accent ? "text-[#D4AF37]" : "text-gray-900"
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-100" />

        {/* Grand total */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">₹{fmt(grand)}</span>
        </div>

        {/* Promo code */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Tag size={11} /> Promo Code
          </label>
          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="LUXURY10"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder-gray-300"
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onApplyPromo}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-900 text-white hover:bg-[#D4AF37] transition-colors duration-200"
            >
              Apply
            </motion.button>
          </div>
          {promoApplied && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-green-600 font-medium flex items-center gap-1"
            >
              <Sparkles size={11} /> 10% discount applied!
            </motion.p>
          )}
          {!promoApplied && (
            <p className="text-[11px] text-gray-400">Try <span className="font-semibold text-gray-500">LUXURY10</span> for 10% off</p>
          )}
        </div>

        {/* Free shipping note */}
        {shipping > 0 && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
            <Package size={14} className="text-[#D4AF37] flex-shrink-0" />
            <p className="text-xs text-amber-800">
              Add <span className="font-bold">₹{fmt(2000 - subtotal)}</span> more for free shipping
            </p>
          </div>
        )}

        {/* Checkout button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-sm
                     flex items-center justify-center gap-2 hover:bg-[#D4AF37] transition-colors duration-300
                     shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/20"
        >
          Proceed to Checkout
          <ArrowRight size={16} />
        </motion.button>

        {/* Continue shopping */}
        <Link to="/">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-medium text-sm
                       flex items-center justify-center gap-2 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200 mt-2"
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </motion.button>
        </Link>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-50">
          {["🔒 Secure", "✈️ Express", "↩️ 30-day returns"].map((badge) => (
            <span key={badge} className="text-[10px] text-gray-400 font-medium">{badge}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-6 shadow-inner">
        <ShoppingBag size={36} className="text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        Discover our curated collection of luxury fragrances and find your signature scent.
      </p>
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-sm
                     flex items-center gap-2 hover:bg-[#D4AF37] transition-colors duration-300 shadow-md"
        >
          <Sparkles size={15} />
          Explore Collection
        </motion.button>
      </Link>
    </motion.div>
  );
}

// ─── main Cart page ───────────────────────────────────────────────────────────
function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "LUXURY10") {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
      alert("Invalid promo code. Try LUXURY10.");
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      {/* Subtle top shimmer */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 sm:mb-8">
          <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">Shopping Cart</span>
        </nav>

        {/* Page title */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            {cartItems.length > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span className="text-xs font-semibold text-[#b8922a]">Free gift on orders over ₹4,999</span>
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 items-start">

            {/* ── Cart items (left) ── */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onIncrease={increaseQty}
                      onDecrease={decreaseQty}
                      onRemove={removeFromCart}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Subtotal strip */}
              <motion.div
                layout
                className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <span className="text-sm text-gray-500">Cart subtotal</span>
                <span className="text-lg font-bold text-gray-900">₹{fmt(subtotal)}</span>
              </motion.div>
            </div>

            {/* ── Order summary (right, sticky on desktop) ── */}
            <div className="lg:col-span-1 lg:sticky lg:top-6">
              <OrderSummary
                subtotal={subtotal}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoApplied={promoApplied}
                onApplyPromo={handleApplyPromo}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Cart;