import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useWishlist from "../context/useWhishlist";
import useCart from "../context/useCart";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, cartItems = [], increaseQty } = useCart();

  // Track item-level processing states independently using the product ID
  const [processingId, setProcessingId] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCartClick = async (product) => {
    if (processingId === product.id) return;
    
    if (product.stock_quantity <= 0) {
      toast.error("Out of stock");
      return;
    }
    
    // Check if the item is already in the cart first
    const cartItem = cartItems.find(item => item.product_id === product.id || item.id === product.id);
    
    if (cartItem) {
      // If already in cart, increase quantity without triggering the loading spinner
      if (cartItem.quantity >= product.stock_quantity) {
        toast.error("Stock not available more");
        return;
      }
      try {
        await increaseQty(cartItem);
      } catch (err) {
        console.error("Failed to increase quantity:", err);
      }
    } else {
      // If not in cart, trigger the loading spinner for the initial add
      try {
        setProcessingId(product.id);
        await addToCart(product);
      } catch (err) {
        console.error("Failed to add variant to cart:", err);
      } finally {
        setProcessingId(null);
      }
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 mb-4">
          <Heart size={24} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-xs text-center leading-relaxed">
          Curate your personal collection of signature scents. Start exploring to add items here.
        </p>
        <Link
          to="/shop"
          className="bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 no-underline shadow-sm"
        >
          Explore Catalog <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ══ HEADER ══ */}
        <div className="border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-rose-500">Personal Vault</p>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-black tracking-tight text-[#1a0533]">My Wishlist</h1>
            <p className="text-xs font-bold text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>
        </div>

        {/* ══ WISHLIST GRID ══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlistItems.map((product) => {
            const cartItem = cartItems.find((item) => item.product_id === product.id || item.id === product.id);
            const isInCart = !!cartItem;
            const isButtonLoading = processingId === product.id;

            return (
              <div 
                key={product.id} 
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col relative"
              >
                {/* BADGE TOP RIGHT */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  {product.stock_quantity > 0 ? (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">In Stock</span>
                  ) : (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">Out of Stock</span>
                  )}
                </div>

                {/* REMOVE BUTTON TOP LEFT */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur border border-slate-100 text-slate-400 flex items-center justify-center hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-colors shadow-sm cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 size={13} />
                </button>

                {/* IMAGE AREA */}
                <Link to={`/viewdetail/${product.id}`} className="block relative aspect-[4/5] bg-slate-100 overflow-hidden shrink-0 mt-5">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* PRODUCT DETAILS */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-widest text-violet-600 mb-1">
                      {product.brand || "Lumière"}
                    </p>
                    <Link to={`/viewdetail/${product.id}`} className="no-underline">
                      <h3 className="font-bold text-sm text-slate-800 leading-snug line-clamp-2 hover:text-violet-700 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <p className="text-base font-black text-slate-900">
                      ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                    </p>

                    {/* ACTION CONTROLS */}
                    <button
                      disabled={isButtonLoading || product.stock_quantity <= 0}
                      onClick={() => handleAddToCartClick(product)}
                      className={`w-full text-xs font-semibold uppercase tracking-wider rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-60 cursor-pointer ${
                        product.stock_quantity <= 0 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : isInCart
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {isButtonLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : isInCart ? (
                        <span>In Cart ({cartItem.quantity}) ✓</span>
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