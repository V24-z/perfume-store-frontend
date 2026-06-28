import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import useWishlist from "../context/useWhishlist";
import useCart from "../context/useCart";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, cartItems = [] } = useCart();

  // Track item-level processing states independently using the product ID
  const [processingId, setProcessingId] = useState(null);

  const handleAddToCartClick = async (product) => {
    if (processingId) return;
    try {
      setProcessingId(product.id);
      await addToCart(product);
    } catch (err) {
      console.error("Failed to add variant to cart:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 border border-rose-100 shadow-sm mb-5 animate-pulse">
          <Heart size={32} />
        </div>

        <h2 className="text-xl font-black tracking-tight text-[#1a0533]">
          Your Wishlist is Empty
        </h2>

        <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
          Save your favourite perfumes here to keep track of your signature scents.
        </p>

        <Link
          to="/"
          className="mt-6 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-6 py-3.5 rounded-xl shadow-sm hover:bg-slate-800 transition-all active:scale-95 no-underline border-0"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ══ HEADER ══ */}
        <div className="border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Lumière Boutique</p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#1a0533]">
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>

        {/* ══ PRODUCT GRID ══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const isInCart = cartItems.some((item) => item.product_id === product.id || item.id === product.id);
            const isButtonLoading = processingId === product.id;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col h-full"
              >
                {/* IMAGE WINDOW */}
                <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* CARD DATA */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-violet-600">
                      {product.brand}
                    </p>
                    <h3 className="font-bold text-sm text-[#1a0533] leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p className="text-base font-extrabold text-[#1a0533]">
                      ₹{new Intl.NumberFormat("en-IN").format(
                        product.discount_price > 0 ? product.discount_price : product.price
                      )}
                    </p>

                    {/* ACTION CONTROLS */}
                    <div className="flex gap-2 pt-0.5">
                      <button
                        disabled={isInCart || processingId !== null}
                        onClick={() => handleAddToCartClick(product)}
                        className={`flex-1 text-xs font-bold uppercase tracking-wider rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 border-0 shadow-sm transition-all active:scale-95 disabled:scale-100 disabled:opacity-60 cursor-pointer ${
                          isInCart
                            ? "bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-inset ring-emerald-600/10 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        {isButtonLoading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : isInCart ? (
                          "In Cart ✓"
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        disabled={processingId !== null}
                        onClick={() => removeFromWishlist(product.id)}
                        className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100/50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}