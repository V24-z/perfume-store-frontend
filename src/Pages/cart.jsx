import { useMemo } from "react";
import { Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
//import { useAuth } from "../context/useAuth";
import  useCart  from "../context/useCart";

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
function OrderSummary({ subtotal }) {
  const shipping = subtotal > 1999 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white border rounded-xl p-5">
      <h2 className="font-bold mb-4">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{fmt(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{fmt(tax)}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{fmt(total)}</span>
        </div>
      </div>

      
        <Link to="/checkout" className="w-full mt-4 bg-black text-white py-2 rounded-lg">
        Checkout
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
    0
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
      <OrderSummary subtotal={subtotal} />
    </motion.div>
  );
}