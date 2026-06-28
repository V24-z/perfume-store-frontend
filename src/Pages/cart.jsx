import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import useCart from "../context/useCart";

// ─── Animations ───
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ─── Helper ───
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ─── CART ITEM CARD ───
function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  const lineTotal = (item.products?.price || 0) * (item.quantity || 0);

  return (
    <motion.div
      variants={itemVariants}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
        <img
          src={item.products?.image_url}
          alt={item.products?.name || "Product"}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-[#1a0533] leading-snug truncate">
            {item.products?.name}
          </h3>
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.products?.name || "item"} from cart`}
            className="p-1.5 -mr-1 -mt-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 border-0 bg-transparent cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <p className="text-xs font-medium text-slate-400 mt-0.5">
          ₹{fmt(item.products?.price)} each
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-1.5 py-1">
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.0 }}
              onClick={() => onDecrease(item)}
              aria-label="Decrease quantity"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors duration-200 focus:outline-none border-0 bg-transparent cursor-pointer"
            >
              <Minus size={12} />
            </motion.button>

            <span className="w-5 text-center text-xs font-bold text-slate-800 tabular-nums">
              {item.quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.0 }}
              onClick={() => onIncrease(item)}
              aria-label="Increase quantity"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors duration-200 focus:outline-none border-0 bg-transparent cursor-pointer"
            >
              <Plus size={12} />
            </motion.button>
          </div>

          <p className="font-extrabold text-sm text-[#1a0533] tabular-nums">
            ₹{fmt(lineTotal)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── ORDER SUMMARY ───
function OrderSummary({ subtotal, itemCount }) {
  const shipping = subtotal > 1999 ? 0 : 199;
  const total = subtotal + shipping;
  const disabled = itemCount === 0;

  return (
    <>
      {/* Desktop / Tablet Summary Card Container */}
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-6 shadow-sm"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Order Valuation
        </p>
        <h2 className="font-black text-base text-[#1a0533] mb-5 tracking-tight">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
        </h2>

        <div className="space-y-3.5 text-xs font-medium text-slate-500">
          <div className="flex justify-between items-center">
            <span>Bag Subtotal</span>
            <span className="tabular-nums font-bold text-slate-800">
              ₹{fmt(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Shipping Fees</span>
            <span className="tabular-nums font-bold text-slate-800">
              {shipping === 0 ? (
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Free</span>
              ) : (
                `₹${fmt(shipping)}`
              )}
            </span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-200 my-5" />

        <div className="flex items-center justify-between bg-[#1a0533] text-white rounded-xl px-4 py-3.5 shadow-inner">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-300">Total Due</span>
          <span className="text-lg font-black tabular-nums">
            ₹{fmt(total)}
          </span>
        </div>

        <Link
          to="/checkout"
          aria-disabled={disabled}
          className={`group relative flex items-center justify-center gap-2 w-full mt-5 py-3.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider no-underline border-0 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/10
            ${
              disabled
                ? "bg-slate-100 text-slate-400 pointer-events-none"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-95"
            }`}
        >
          Proceed to Checkout
          {!disabled && (
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </Link>

        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-violet-600" /> Secure Checkout Guaranteed
          </span>
        </div>
      </motion.div>

      {/* Mobile Sticky Bottom Checkout Banner */}
      {!disabled && (
        <div className="fixed inset-x-0 bottom-0 z-40 md:hidden animate-fade-in">
          <div className="bg-white/95 backdrop-blur border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-8px_30px_rgb(0,0,0,0.06)]">
            <div>
              <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Summary</p>
              <p className="font-black text-lg text-[#1a0533] tabular-nums mt-0.5">
                ₹{fmt(total)}
              </p>
            </div>
            <Link
              to="/checkout"
              className="flex-1 max-w-[180px] flex items-center justify-center gap-1.5 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider no-underline border-0 active:scale-95 transition-all shadow-sm"
            >
              Checkout
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ─── SHIMMER SKELETON LOADER ───
function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 animate-pulse"
        >
          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-8 bg-slate-100 rounded-lg w-28 mt-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── EMPTY STATE VIEW ───
function EmptyCart() {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center text-center py-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl"
    >
      <div className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-5 text-slate-400">
        <ShoppingBag size={22} />
      </div>
      <h3 className="text-base font-bold text-[#1a0533] mb-1">
        Your bag is empty
      </h3>
      <p className="text-slate-400 text-xs mb-6 max-w-xs leading-relaxed">
        Looks like you haven't added anything yet. Start exploring our curated collections to fill it up.
      </p>
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider no-underline border-0 hover:bg-slate-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </motion.div>
  );
}

// ─── MAIN CART CONTAINER ───
export default function Cart() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    loading,
  } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, i) => sum + (i.products?.price || 0) * (i.quantity || 0),
      0
    );
  }, [cartItems]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-50/30 text-slate-900 antialiased font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pb-28 md:pb-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-5"
        >
          <Link to="/" className="hover:text-violet-600 no-underline text-slate-400 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-[#1a0533] font-bold">Cart</span>
        </nav>

        {/* Header Title Section */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a0533]">
            Shopping Bag
          </h1>
        </div>
        <p className="text-xs font-medium text-slate-400 mb-8 pl-4">
          {loading
            ? "Syncing database items…"
            : `${cartItems.length} ${
                cartItems.length === 1 ? "variant" : "variants"
              } calibrated for checkout`}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT CART AREA */}
          <div className="lg:col-span-2">
            {loading && <CartSkeleton />}

            {!loading && cartItems.length === 0 && <EmptyCart />}

            {!loading && cartItems.length > 0 && (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence>
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
            )}
          </div>

          {/* RIGHT SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} itemCount={cartItems.length} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}