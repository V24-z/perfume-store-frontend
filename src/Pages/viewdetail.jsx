import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useCart from "../context/useCart";
import axios from "axios";
import { animate } from "motion";
import useCartAnimation from "../context/usecartAnimation";
import { Heart, ShoppingBag, Zap, ChevronLeft } from "lucide-react";
import useWishlist from "../context/useWhishlist";

const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

function ViewSingleProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { cartPosition } = useCartAnimation();
  const { addToCart, cartItems, increaseQty } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const imgRef = useRef(null);

  const isWishlisted = product ? wishlistItems.some((item) => item.id === product.id) : false;

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products/by-id/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const flyToCart = () => {
    if (!imgRef.current || !cartPosition) return;

    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const clone = img.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = "999999";
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const dx = cartPosition.x - startX;
    const dy = cartPosition.y - startY;

    animate(clone, 
      { x: [0, dx], y: [0, dy], scale: [1, 0.3], opacity: [1, 0] },
      { duration: 0.9, easing: "ease-in-out", onComplete: () => clone.remove() }
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-lg text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">{error}</div>;
  if (!product) return null;

  const stockStatus = product.stock_quantity > 10 ? { label: "In Stock", color: "bg-green-50 text-green-700 ring-green-600/20" } : 
                      product.stock_quantity > 0 ? { label: `Only ${product.stock_quantity} left`, color: "bg-amber-50 text-amber-700 ring-amber-600/20" } : 
                      { label: "Out of Stock", color: "bg-red-50 text-red-700 ring-red-600/20" };

  const cartItem = cartItems.find((item) => item.product_id === product.id || item.id === product.id);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors font-bold uppercase tracking-wider text-xs"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Boutique
        </button>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── BIG IMAGE SECTION (Takes up 7 columns) ── */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="relative aspect-[4/5] md:aspect-square bg-slate-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-100 flex items-center justify-center group">
              
              {/* TOP RIGHT WISHLIST ICON */}
              <button 
                onClick={toggleWishlist}
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                title="Toggle Wishlist"
              >
                <Heart 
                  size={24} 
                  className={`transition-colors duration-300 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} 
                /> 
              </button>

              <img 
                ref={imgRef} 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>
          </div>

          {/* ── PRODUCT DETAILS (Takes up 5 columns) ── */}
          <div className="lg:col-span-5 flex flex-col py-4 lg:py-10">
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-violet-600 font-black tracking-[0.2em] text-[10px] uppercase">
                  {product.brand}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ring-1 ring-inset ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-slate-900 tabular-nums">
                ₹{new Intl.NumberFormat("en-IN").format(product.price)}
              </p>
            </div>

            <div className="w-12 h-1 bg-slate-200 mb-8 rounded-full" />

            <p className="text-slate-500 leading-relaxed mb-10 text-base md:text-lg font-medium">
              {product.description}
            </p>

            <div className="flex flex-col gap-4 mt-auto">
              <button
                onClick={() => {
                  if (cartItem && increaseQty) {
                    increaseQty(cartItem);
                  } else {
                    flyToCart();
                    addToCart(product);
                  }
                }}
                disabled={product.stock_quantity === 0}
                className={`w-full flex items-center justify-center gap-3 py-4 md:py-5 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer ${
                  cartItem 
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20" 
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                }`}
              >
                <ShoppingBag size={18} />
                {cartItem ? `In Cart (${cartItem.quantity}) ✓` : "Add To Bag"}
              </button>
              
              <button 
                onClick={() => { 
                  if (!cartItem) addToCart(product); 
                  navigate("/checkout"); 
                }} 
                disabled={product.stock_quantity === 0}
                className="w-full flex items-center justify-center gap-3 border-2 border-slate-900 bg-white text-slate-900 py-4 md:py-5 rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:border-slate-300 disabled:text-slate-400 disabled:pointer-events-none cursor-pointer"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSingleProduct;