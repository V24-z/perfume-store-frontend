import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen bg-[#fafafa] text-slate-900 antialiased font-sans flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 mb-6">
          <Heart size={24} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Your wishlist is empty
        </h2>

        <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
          Save your favourite perfumes here to keep track of your signature scents.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white px-7 py-4 rounded-full shadow-sm hover:bg-slate-800 transition-all active:scale-98"
        >
          Explore Boutique
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 antialiased font-sans p-6 sm:p-12">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ══ HEADER ══ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-1 rounded-full bg-slate-900" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Lumière Boutique</p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Wishlist
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* ══ PRODUCT GRID ══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {wishlistItems.map((product) => {
            const isInCart = cartItems.some((item) => item.product_id === product.id || item.id === product.id);
            const isButtonLoading = processingId === product.id;

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                {/* IMAGE WINDOW */}
                <div className="relative aspect-[4/5] w-full bg-slate-50 overflow-hidden shrink-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  
                  {/* FLOATING REMOVE BUTTON */}
                  <button
                    disabled={processingId !== null}
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 text-slate-500 hover:bg-white hover:text-rose-600 flex items-center justify-center shadow-sm transition-all active:scale-90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer z-10"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>

                {/* CARD DATA */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {product.brand}
                    </p>
                    <h3 className="font-medium text-sm text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </div>

                  <div className="space-y-4 pt-1">
                    <p className="text-base font-semibold text-slate-900">
                      ₹{new Intl.NumberFormat("en-IN").format(
                        product.discount_price > 0 ? product.discount_price : product.price
                      )}
                    </p>

                    {/* ACTION CONTROLS */}
                    <button
                      disabled={isInCart || processingId !== null}
                      onClick={() => handleAddToCartClick(product)}
                      className={`w-full text-xs font-semibold uppercase tracking-wider rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:scale-100 disabled:opacity-60 cursor-pointer ${
                        isInCart
                          ? "bg-slate-50 text-slate-400 font-medium border border-slate-200/60 cursor-not-allowed shadow-none"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {isButtonLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : isInCart ? (
                        <span>Added to Cart ✓</span>
                      ) : (
                        <>
                          <ShoppingCart size={13} strokeWidth={2.5} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
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