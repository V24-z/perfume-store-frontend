import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ShoppingCart, Heart, Eye, Search, SlidersHorizontal } from "lucide-react";
import { animate } from "motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useCart from "../context/useCart";
import useCartAnimation from "../context/usecartAnimation";
import useWishlist from "../context/useWhishlist";

const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

export default function Shop() {
  const { addToCart, cartItems = [], increaseQty } = useCart();
  const { cartPosition } = useCartAnimation();

  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // ── FILTER RACE CONDITION FIX (AbortController) ──
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach((key) => {
          if (filters[key]) queryParams.append(key, filters[key]);
        });

        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/products?${queryParams.toString()}`, {
            signal: controller.signal,
          }),
          axios.get(`${API_URL}/categories`, {
            signal: controller.signal,
          }),
        ]);

        setProducts(prodRes.data?.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        // Prevent logging errors if the request was intentionally aborted
        if (!axios.isCancel(err)) {
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => {
      clearTimeout(delayDebounceFn);
      // Cancel the pending API request if the user types another letter immediately
      controller.abort(); 
    };
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


//---------fly to cart---------------

// Animation helper
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
    clone.style.borderRadius = "12px";
    document.body.appendChild(clone);

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const dx = cartPosition.x - startX;
    const dy = cartPosition.y - startY;

    animate(clone, { x: [0, dx], y: [0, dy], scale: [1, 0.2], opacity: [1, 0] }, { duration: 0.8, easing: "ease-in-out", onComplete: () => clone.remove() });
  };





  const handleAddToCartClick = async (e, product) => {
    e.preventDefault();
    if (processingId === product.id) return;
    
    if (product.stock_quantity <= 0) {
      toast.error("Out of stock");
      return;
    }

    const cartItem = cartItems.find((item) => item.product_id === product.id);
    
    if (cartItem && cartItem.quantity >= product.stock_quantity) {
      toast.error("Stock not available more");
      return;
    }

    setProcessingId(product.id);
    try {
      if (cartItem && increaseQty) {
        await increaseQty(cartItem);
      } else {
        await addToCart(product);
        flyToCart(product.id);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    const isWishlisted = wishlistItems.some((w) => w.id === product.id);
    
    if (!isWishlisted && product.stock_quantity <= 0) {
      toast.error("Out of stock");
      return;
    }
    
    if (isWishlisted) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 md:py-6 space-y-4 md:space-y-0 md:flex items-center justify-between gap-6">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search signatures, ingredients, or notes..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <select
                name="category_id"
                value={filters.category_id}
                onChange={handleFilterChange}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer min-w-[140px]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer min-w-[140px]"
              >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR FILTERS */}
          <div className="w-full lg:w-64 shrink-0 space-y-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-32">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={14} /> Filter by Brand
              </h3>
              <div className="relative">
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Chanel"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Price Ceiling
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  name="max_price"
                  min="0"
                  max="50000"
                  step="500"
                  value={filters.max_price || 50000}
                  onChange={handleFilterChange}
                  className="w-full accent-slate-900"
                />
                <div className="flex items-center justify-between text-sm font-bold text-slate-700 tabular-nums">
                  <span>₹0</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-lg">
                    Up to ₹{filters.max_price || "50,000+"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="flex-1 w-full">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">The Collection</h1>
              <p className="text-sm font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                {products.length} Results
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl p-3 border border-slate-100 shadow-sm h-80">
                    <div className="w-full h-48 bg-slate-100 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                  <Search size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No fragrances found</h2>
                <p className="text-slate-500 max-w-sm">We couldn't find any products matching your current filters. Try adjusting your search.</p>
                <button
                  onClick={() => setFilters({ search: "", category_id: "", brand: "", max_price: "", sort: "" })}
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => {
                  const cartItem = cartItems.find((item) => item.product_id === product.id);
                  const isInCart = !!cartItem;
                  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
                  const cannotAdd = !isWishlisted && product.stock_quantity <= 0;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group relative"
                    >
                      {/* IN STOCK / OUT OF STOCK BADGE TOP RIGHT */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        {product.stock_quantity > 0 ? (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">In Stock</span>
                        ) : (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">Out of Stock</span>
                        )}
                      </div>

                      {/* WISHLIST BUTTON TOP LEFT */}
                      <button
                        onClick={(e) => handleWishlistClick(e, product)}
                        disabled={cannotAdd}
                        className={`absolute top-2.5 left-2.5 z-10 p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 ${
                          cannotAdd 
                            ? 'bg-white/50 text-slate-400 cursor-not-allowed' 
                            : isWishlisted 
                            ? 'bg-white/90 text-rose-500 hover:bg-rose-50' 
                            : 'bg-white/70 text-slate-400 hover:bg-white hover:text-rose-500'
                        }`}
                      >
                        <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
                      </button>

                      <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden shrink-0 mt-5">
                        <Link to={`/viewdetail/${product.id}`}>
                          <img
                            ref={(el) => (imageRefs.current[product.id] = el)}
                            src={product.image_url}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <div className="mb-auto">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1 line-clamp-1">
                            {product.brand}
                          </p>
                          <Link to={`/viewdetail/${product.id}`} className="no-underline">
                            <h3 className="font-bold text-sm text-slate-800 leading-snug line-clamp-2 group-hover:text-slate-900 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                        </div>
                        <div className="mt-4 space-y-3">
                          <p className="font-black text-lg text-slate-900 tabular-nums">
                            ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                          </p>
                          <div className="flex gap-2">
                            <button
                              disabled={product.stock_quantity <= 0 || processingId === product.id}
                              onClick={(e) => handleAddToCartClick(e, product)}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                                product.stock_quantity <= 0
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : isInCart
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20"
                                  : "bg-slate-900 text-white hover:bg-slate-800"
                              }`}
                            >
                              {processingId === product.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              ) : isInCart ? (
                                `In Cart (${cartItem.quantity}) ✓`
                              ) : (
                                <>
                                  <ShoppingCart size={14} className="flex-shrink-0" />
                                  Add Cart
                                </>
                              )}
                            </button>

                            <Link
                              to={`/viewdetail/${product.id}`}
                              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 shadow-sm transition-colors flex items-center justify-center"
                              title="Quick View"
                            >
                              <Eye size={15} className="flex-shrink-0" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}