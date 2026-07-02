import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCart from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================================================================
   Design tokens (used inline via Tailwind arbitrary values)
   ink     #111827  – primary text / CTA
   paper   #FAF9F6  – page background
   card    #FFFFFF  – card surfaces
   spruce  #0B6E4F  – trust accent (COD, success, free delivery)
   sand    #F0ECE3  – muted surface / icon chips
   line    #E7E2D9  – warm hairline border
   slate   #6B7280  – secondary text
   ========================================================================= */

/* ---------------------------- Inline icons ---------------------------- */
const TruckIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M2.5 6.5h10.5v8.25H2.5z M13 9.5h3.4l3.1 3v2.25h-6.5z M5.25 17.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M16 17.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BoxIcon = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M3.5 7.5 12 3.25 20.5 7.5 12 11.75 3.5 7.5Z M3.5 7.5v9l8.5 4.25 8.5-4.25v-9 M12 11.75v9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M5 12.5 9.5 17 19 7"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SpinnerIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* --------------------------- Motion variants --------------------------- */
const pageVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const summaryVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
  },
};

const toggleVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45 } },
};

const staggerCards = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const staggerFields = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerItems = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const itemVariant = {
  hidden: { opacity: 0, x: 14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/* ------------------------------ Empty state ------------------------------ */
function EmptyCartState({ onContinue }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F6] px-6 py-20">
      <motion.div initial="hidden" animate="visible" variants={pageVariants} className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F0ECE3]">
          <BoxIcon className="h-11 w-11 text-[#0B6E4F]" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#111827]">Your cart is empty</h2>
        <p className="mx-auto mt-2 max-w-sm text-[#6B7280]">
          Looks like you haven&apos;t added anything yet. Find something you&apos;ll love and come back to check out.
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#111827] px-8 py-3.5 font-semibold text-white shadow-lg shadow-black/10 border-0 cursor-pointer transition-colors hover:bg-black"
        >
          Continue shopping
        </motion.button>
      </motion.div>
    </div>
  );
}

/* -------------------------------- Checkout -------------------------------- */
function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!formData.phone.trim()) {
      toast.info("Phone number is required");
      return;
    }

    if (!formData.address.trim()) {
      toast.info("Address is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        user_id: user.id,
        shipping_address: formData.address,
        phone_number: formData.phone,
      };

      // FIXED: Retrieve the token and pass it in the Authorization headers
      const token = localStorage.getItem("access_token");

      const response = await axios.post(`${API_URL}/orders/checkout`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(`Order Created Successfully!`);
      await clearCart();
      navigate(`/order-success/${response.data.order_id}`);
    } catch (error) {
      console.error("Checkout Error:", error);
      const message = error.response?.data?.detail || "Checkout failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <EmptyCartState onContinue={() => navigate("/")} />;
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemPrice = (item) => item.products?.price ?? item.price ?? 0;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + itemPrice(item) * item.quantity,
    0
  );
  const hasPricing = cartItems.some((item) => itemPrice(item) > 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 sm:py-12">
      <motion.div initial="hidden" animate="visible" variants={pageVariants} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-sm font-semibold text-[#0B6E4F]">Step 2 of 2</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-[#6B7280]">Review your details and confirm your order.</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
          
          {/* ----------------------------- LEFT COLUMN ----------------------------- */}
          <motion.div initial="hidden" animate="visible" variants={staggerCards} className="space-y-6">
            
            {/* Shipping information */}
            <motion.section variants={cardVariants} aria-labelledby="shipping-heading" className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm shadow-black/5 sm:p-8">
              <h2 id="shipping-heading" className="mb-6 flex items-center gap-2.5 text-lg font-semibold text-[#111827]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0ECE3] text-xs font-bold text-[#0B6E4F]">1</span>
                Shipping information
              </h2>

              <motion.div initial="hidden" animate="visible" variants={staggerFields} className="space-y-5">
                <motion.div variants={fieldVariant}>
                  <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-[#374151]">Full name</label>
                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    disabled={loading}
                    autoComplete="name"
                    placeholder="Jane Appleseed"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E7E2D9] bg-[#FCFBF9] px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] transition-colors duration-200 focus:border-[#0B6E4F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]/20 disabled:opacity-60"
                  />
                </motion.div>

                <motion.div variants={fieldVariant}>
                  <div className="relative">
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-[#374151]">
                      Phone number <span className="text-[#0B6E4F]">*</span>
                    </label>
                    <span className="absolute left-4 top-[80%] -translate-y-1/2 text-sm font-medium text-[#1a0533] pointer-events-none">
                      +91
                    </span>
                    <span className="absolute left-12 top-[80%] -translate-y-1/2 text-slate-300 pointer-events-none">|</span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      disabled={loading}
                      maxLength={10}
                      autoComplete="tel"
                      required
                      aria-required="true"
                      placeholder="xxxxxxxxxx"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E7E2D9] bg-[#FCFBF9] px-4 py-3 pl-16 text-[#111827] placeholder:text-[#9CA3AF] transition-colors duration-200 focus:border-[#0B6E4F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]/20 disabled:opacity-60"
                    />
                  </div>
                </motion.div>

                <motion.div variants={fieldVariant}>
                  <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Shipping address <span className="text-[#0B6E4F]">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    disabled={loading}
                    required
                    aria-required="true"
                    placeholder="Street address, city, state, ZIP"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#E7E2D9] bg-[#FCFBF9] px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] transition-colors duration-200 focus:border-[#0B6E4F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]/20 disabled:opacity-60"
                  />
                </motion.div>
              </motion.div>
            </motion.section>

            {/* Payment method */}
            <motion.section variants={cardVariants} aria-labelledby="payment-heading" className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm shadow-black/5 sm:p-8">
              <h2 id="payment-heading" className="mb-6 flex items-center gap-2.5 text-lg font-semibold text-[#111827]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0ECE3] text-xs font-bold text-[#0B6E4F]">2</span>
                Payment method
              </h2>

              <div role="radiogroup" aria-label="Payment method">
                <label className="relative flex items-start gap-4 rounded-xl border-2 border-[#0B6E4F] bg-[#0B6E4F]/[0.05] p-4 transition-colors sm:p-5">
                  <input type="radio" name="paymentMethod" value="cod" checked readOnly aria-checked="true" className="sr-only" />
                  <span className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#0B6E4F] text-white">
                    <TruckIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#111827]">Cash on Delivery</span>
                      <span className="inline-flex items-center rounded-full bg-[#0B6E4F] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                        COD
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-[#6B7280]">Pay when your order arrives at your doorstep.</span>
                  </span>
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0B6E4F] text-white">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                </label>
              </div>
            </motion.section>
          </motion.div>

          {/* ----------------------------- RIGHT COLUMN ----------------------------- */}
          <motion.div initial="hidden" animate="visible" variants={summaryVariants} className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-md shadow-black/5">
              <div className="p-6 sm:p-7">
                <h2 className="mb-5 text-lg font-semibold text-[#111827]">Order summary</h2>

                <motion.ul initial="hidden" animate="visible" variants={staggerItems} className="-mr-1 max-h-80 space-y-4 overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const price = itemPrice(item);
                    const image = item.products?.image_url || item.products?.image;
                    return (
                      <motion.li key={item.id} variants={itemVariant} className="flex items-center gap-3">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-[#F0ECE3] ring-1 ring-black/5">
                          {image ? (
                            <img src={image} alt={item.products?.name || "Product"} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#9CA3AF]">
                              <BoxIcon className="h-6 w-6" />
                            </div>
                          )}
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#111827] px-1 text-[11px] font-bold text-white ring-2 ring-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#111827]">{item.products?.name || "Product"}</p>
                          <p className="font-mono text-xs text-[#6B7280]">
                            Qty {item.quantity}
                            {price > 0 ? ` · ₹${price.toFixed(2)}` : ""}
                          </p>
                        </div>
                        {price > 0 && (
                          <p className="flex-shrink-0 font-mono text-sm font-semibold text-[#111827]">
                            ₹{(price * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </motion.li>
                    );
                  })}
                </motion.ul>

                {/* Perforated, receipt-style divider */}
                <div className="relative my-6">
                  <div className="border-t-2 border-dashed border-[#E7E2D9]" />
                  <span className="absolute -left-9 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#FAF9F6]" />
                  <span className="absolute -right-9 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#FAF9F6]" />
                </div>

                <dl className="space-y-2.5 font-mono text-sm">
                  <div className="flex justify-between text-[#6B7280]">
                    <dt>Total items</dt>
                    <dd className="text-[#111827]">{totalItems}</dd>
                  </div>
                  {hasPricing && (
                    <div className="flex justify-between text-[#6B7280]">
                      <dt>Subtotal</dt>
                      <dd className="text-[#111827]">₹{subtotal.toFixed(2)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6B7280]">
                    <dt>Delivery</dt>
                    <dd className="font-semibold text-[#0B6E4F]">Free</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between border-t border-[#E7E2D9] pt-4">
                  <span className="font-sans text-base font-semibold text-[#111827]">Total</span>
                  <span className="font-mono text-xl font-bold text-[#111827]">
                    {hasPricing ? `₹${subtotal.toFixed(2)}` : "—"}
                  </span>
                </div>
              </div>

              <div className="bg-[#F0ECE3] px-6 py-5 sm:px-7">
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-black/5">
                  <TruckIcon className="h-4 w-4 flex-shrink-0 text-[#0B6E4F]" />
                  <span className="text-xs font-medium text-[#374151]">
                    Paying with <span className="font-semibold">Cash on Delivery</span>
                  </span>
                  <span className="ml-auto rounded-full bg-[#0B6E4F] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    COD
                  </span>
                </div>

                <motion.button
                  type="button"
                  whileHover={!loading && cartItems.length > 0 ? { scale: 1.015 } : {}}
                  whileTap={!loading && cartItems.length > 0 ? { scale: 0.985 } : {}}
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  aria-busy={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111827] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/10 border-0 cursor-pointer transition-colors duration-200 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#111827]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {loading ? (
                      <motion.span
                        key="loading"
                        variants={toggleVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="flex items-center gap-2"
                      >
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                          className="inline-flex"
                        >
                          <SpinnerIcon className="h-5 w-5" />
                        </motion.span>
                        Processing order…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        variants={toggleVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        Place order
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-[#6B7280]">
                  <LockIcon className="h-3.5 w-3.5" />
                  Your information stays private and secure.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

export default Checkout;