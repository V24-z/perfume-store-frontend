import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";
//import { useAuth } from "../context/useAuth";
import useCart from "../context/useCart";

// ─── animations ───
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// additive variants (new — used for stagger + simple fades, do not replace the two above)
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ─── helper ───
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ─── CART ITEM ───
function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  const lineTotal = (item.products?.price || 0) * (item.quantity || 0);

  return (
    <motion.div
      variants={itemVariants}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
      layout
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={item.products?.image_url}
          alt={item.products?.name || "Product"}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-neutral-900 leading-snug truncate">
            {item.products?.name}
          </h3>
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.products?.name || "item"} from cart`}
            className="p-1.5 -mr-1 -mt-1 rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="text-sm text-neutral-500 mt-0.5">
          ₹{fmt(item.products?.price)} each
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-3 rounded-full border border-neutral-200 px-1.5 py-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onDecrease(item)}
              aria-label="Decrease quantity"
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <Minus size={13} />
            </motion.button>

            <span className="w-5 text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onIncrease(item)}
              aria-label="Increase quantity"
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <Plus size={13} />
            </motion.button>
          </div>

          <p className="font-semibold text-neutral-900 tabular-nums">
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
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  const disabled = itemCount === 0;

  return (
    <>
      {/* Desktop / tablet summary card */}
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
          Order Summary
        </p>
        <h2 className="font-bold text-lg text-neutral-900 mb-5">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
        </h2>

        <div className="space-y-3 text-sm text-neutral-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums text-neutral-900">
              ₹{fmt(subtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="tabular-nums">
              {shipping === 0 ? (
                <span className="text-emerald-600 font-medium">Free</span>
              ) : (
                `₹${fmt(shipping)}`
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span className="tabular-nums text-neutral-900">₹{fmt(tax)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-neutral-300 my-5" />

        <div className="flex items-center justify-between bg-neutral-900 text-white rounded-xl px-4 py-3.5">
          <span className="font-medium">Total</span>
          <span className="text-lg font-bold tabular-nums">
            ₹{fmt(total)}
          </span>
        </div>

        <Link
          to="/checkout"
          aria-disabled={disabled}
          className={`group relative flex items-center justify-center gap-2 w-full mt-5 py-3.5 rounded-xl text-center font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2
            ${
              disabled
                ? "bg-neutral-200 text-neutral-400 pointer-events-none"
                : "bg-gradient-to-r from-neutral-900 to-neutral-800 text-white hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            }`}
        >
          Proceed to Checkout
          {!disabled && (
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </Link>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Truck size={14} /> Free over ₹1,999
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} /> Secure checkout
          </span>
        </div>
      </motion.div>

      {/* Mobile sticky checkout bar */}
      {!disabled && (
        <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
          <div className="bg-white/95 backdrop-blur border-t border-neutral-200 px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]">
            <div>
              <p className="text-xs text-neutral-500">Total</p>
              <p className="font-bold text-neutral-900 tabular-nums">
                ₹{fmt(total)}
              </p>
            </div>
            <Link
              to="/checkout"
              className="flex-1 max-w-[180px] flex items-center justify-center gap-1.5 bg-neutral-900 text-white py-3 rounded-xl font-semibold active:scale-[0.97] transition-transform"
            >
              Checkout
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ─── SKELETON LOADER ───
function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 animate-pulse"
        >
          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-neutral-100 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-neutral-100 rounded w-3/4" />
            <div className="h-3 bg-neutral-100 rounded w-1/3" />
            <div className="h-8 bg-neutral-100 rounded-full w-28 mt-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── EMPTY STATE ───
function EmptyCart() {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-neutral-50 border border-neutral-100 rounded-2xl"
    >
      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-5">
        <ShoppingBag size={28} className="text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
        Your bag is empty
      </h3>
      <p className="text-neutral-500 text-sm mb-6 max-w-xs">
        Looks like you haven&apos;t added anything yet. Start exploring and
        fill it up.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        Continue Shopping
      </Link>
    </motion.div>
  );
}

// ─── MAIN CART ───
export default function Cart() {
  //const { user } = useAuth();
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,

    loading,
  } = useCart();

  //const USER_ID = user?.id;

  // safe array
  //const safeCart = Array.isArray(cartItems) ? cartItems : [];

  // subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, i) => sum + (i.products?.price || 0) * (i.quantity || 0),
      0,
    );
  }, [cartItems]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 pb-28 md:pb-12">
        {/* breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-neutral-500 mb-4"
        >
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900 font-medium">Cart</span>
        </nav>

        {/* header */}
        <div className="flex items-center gap-3 mb-1">
          <ShoppingBag className="text-neutral-900" size={26} />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
            Shopping Bag
          </h1>
        </div>
        <p className="text-neutral-500 mb-8">
          {loading
            ? "Loading your items…"
            : `${cartItems.length} ${
                cartItems.length === 1 ? "item" : "items"
              } ready for checkout`}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT CART */}
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

          {/* RIGHT SUMMARY */}
          <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} itemCount={cartItems.length} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}