import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
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

// ─── helper ───
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ─── CART ITEM ───
function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white border rounded-xl p-4 flex gap-4"
    >
      <img
        src={item.products?.image_url}
        className="w-20 h-24 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.products?.name}</h3>
        <p className="text-sm text-gray-500">₹₹{item.products?.price}</p>

        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => onDecrease(item)}>
            <Minus size={14} />
          </button>

          <span>{item.quantity}</span>

          <button onClick={() => onIncrease(item)}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button onClick={() => onRemove(item.id)}>
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}

// ─── ORDER SUMMARY ───
function OrderSummary({ subtotal, itemCount }) {
  const shipping = subtotal > 1999 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white border rounded-xl p-5 sticky top-4">
      <h2 className="font-bold text-lg mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Items ({itemCount})</span>
          <span>₹{fmt(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>₹{fmt(tax)}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>₹{fmt(total)}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className={`block w-full mt-5 py-3 rounded-lg text-center font-medium transition
          ${
            itemCount === 0
              ? "bg-gray-300 text-gray-500 pointer-events-none"
              : "bg-black text-white hover:bg-gray-800"
          }`}
      >
        Proceed to Checkout
      </Link>
    </div>
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
      className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* LEFT CART */}
      <div className="lg:col-span-2 space-y-4">
        {loading && <p>Loading cart...</p>}

        {!loading && cartItems.length === 0 && (
          <p className="text-gray-500">Your cart is empty</p>
        )}

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
      </div>

      {/* RIGHT SUMMARY */}
      <OrderSummary subtotal={subtotal} itemCount={cartItems.length} />
    </motion.div>
  );
}
