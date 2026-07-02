import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ShoppingCart, Heart, Eye, Search, SlidersHorizontal } from "lucide-react";
import { animate } from "motion";
import { Link } from "react-router-dom";

import useCart from "../context/useCart";
import useCartAnimation from "../context/usecartAnimation";
import useWishlist from "../context/useWhishlist";

// Safely access environment variables to prevent esbuild target warnings
const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

export default function Shop() {
  const { addToCart, cartItems = [], increaseQty } = useCart();
  const { cartPosition } = useCartAnimation();

  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dynamic single button async tracking state
  const [processingId, setProcessingId] = useState(null);
  const imageRefs = useRef({});

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    brand: "",
    max_price: "",
    sort: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const flyToCart = (productId) => {
    const img = imageRefs.current[productId];
    if (!img || !cartPosition) return;

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

    animate(
      clone,
      { x: [0, dx], y: [0, dy], scale: [1, 0.8, 0.3], opacity: [1, 1, 0] },
      { duration: 0.8, easing: "ease-in-out", onComplete: () => clone.remove() }
    );
  };

  const handleAddToCart = async (product) => {
    if (processingId) return;
    try {
      setProcessingId(product.id);
      flyToCart(product.id);
      
      const cartItem = cartItems.find((item) => item.product_id === product.id || item.id === product.id);
      if (cartItem && increaseQty) {
        await increaseQty(cartItem);
      } else {
        await addToCart(product);
      }
    } catch (err) {
      console.error("Cart addition execution failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== "")
        );
        const { data } = await axios.get(`${API_URL}/products`, { params: activeFilters });
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/categories`);
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ══ HEADER ══ */}
        <div className="border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Lumière Catalog</p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#1a0533]">Explore Fragrances</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          
          {/* ══ FILTERS SIDEBAR (Sticky Fix Applied) ══ */}
          <aside className="w-full lg:w-72 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5 lg:sticky lg:top-24 shrink-0">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <SlidersHorizontal size={16} className="text-violet-600 shrink-0" />
              <h2 className="font-bold text-sm tracking-tight text-[#1a0533]">Filter Boutique</h2>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-slate-400 shrink-0" />
                </div>
                <input
                  type="text"
                  placeholder="Search fragrances..."
                  value={filters.search}
                  onChange={(e) => handleChange("search", e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Collection</label>
              <select
                value={filters.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 cursor-pointer text-slate-700 transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Maison / Brand</label>
              <input
                type="text"
                placeholder="e.g. Chanel, Dior"
                value={filters.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Max Budget (₹)</label>
              <input
                type="number"
                placeholder="Enter max price"
                value={filters.max_price}
                onChange={(e) => handleChange("max_price", e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
              />
            </div>
          </aside>

          {/* ══ PRODUCTS GRID DISPLAY ══ */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Curating Catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
                <span className="text-3xl block mb-2">🧴</span>
                <p className="text-sm font-semibold tracking-wide">No Olfactory Artworks Match Your Filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
                  const cartItem = cartItems.find((item) => item.product_id === product.id || item.id === product.id);
                  const isInCart = !!cartItem;
                  const isButtonLoading = processingId === product.id;

                  return (
                    <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col h-full relative">
                      <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden shrink-0">
                        <img
                          ref={(el) => (imageRefs.current[product.id] = el)}
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          disabled={processingId !== null}
                          onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all duration-200 active:scale-90 disabled:opacity-50 cursor-pointer ${
                            isWishlisted ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-white/80 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-white"
                          }`}
                        >
                          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className="shrink-0" />
                        </button>
                      </div>

                      <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-violet-600">{product.brand}</p>
                          <h3 className="font-bold text-sm text-[#1a0533] leading-snug line-clamp-2">{product.name}</h3>
                        </div>
                        <div className="space-y-3 pt-2">
                          <p className="text-base font-extrabold text-[#1a0533]">₹{new Intl.NumberFormat("en-IN").format(product.price)}</p>
                          <div className="flex gap-2 w-full pt-1">
                            <button
                              disabled={isButtonLoading}
                              onClick={() => handleAddToCart(product)}
                              className={`flex-1 text-xs font-bold uppercase tracking-wider rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-60 cursor-pointer ${
                                isInCart ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20" : "bg-slate-900 text-white hover:bg-slate-800"
                              }`}
                            >
                              {isButtonLoading ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                              ) : isInCart ? (
                                `In Cart (${cartItem.quantity}) ✓`
                              ) : (
                                <><ShoppingCart size={14} className="shrink-0" /> Add Cart</>
                              )}
                            </button>
                            <Link to={`/viewdetail/${product.id}`} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 shadow-sm transition-colors flex items-center justify-center" title="Quick View">
                              <Eye size={15} className="shrink-0" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}