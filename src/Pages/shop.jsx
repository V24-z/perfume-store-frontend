import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Heart, Eye, X, Search, SlidersHorizontal } from "lucide-react";

import useCart from "../context/useCart";
import useWishlist from "../context/useWhishlist";

const API_URL = import.meta.env.VITE_API_URL;

export default function Shop() {
  const { addToCart, cartItems = [] } = useCart();

  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    brand: "",
    max_price: "",
    sort: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== "")
        );

        const { data } = await axios.get(
          `${API_URL}/products`,
          { params: activeFilters }
        );

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
        const { data } = await axios.get(
          `${API_URL}/categories`
        );

        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ══ FILTERS SIDEBAR ══ */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <SlidersHorizontal size={16} className="text-violet-600" />
              <h2 className="font-bold text-sm tracking-tight text-[#1a0533]">Filter Boutique</h2>
            </div>

            {/* SEARCH */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fragrances..."
                  value={filters.search}
                  onChange={(e) => handleChange("search", e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* CATEGORY */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Collection</label>
              <div className="relative">
                <select
                  value={filters.category_id}
                  onChange={(e) => handleChange("category_id", e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 appearance-none cursor-pointer text-slate-700 font-medium transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 border-l border-slate-200/60 my-2">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* BRAND */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Maison / Brand</label>
              <input
                type="text"
                placeholder="e.g. Chanel, Dior"
                value={filters.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
              />
            </div>

            {/* MAX PRICE */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Max Budget (₹)</label>
              <input
                type="number"
                placeholder="Enter max price"
                value={filters.max_price}
                onChange={(e) => handleChange("max_price", e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
              />
            </div>

            {/* SORT */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Arrange By</label>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleChange("sort", e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 appearance-none cursor-pointer text-slate-700 font-medium transition-all"
                >
                  <option value="">Default sorting</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 border-l border-slate-200/60 my-2">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ══ PRODUCTS GRID DISPLAY ══ */}
          <div className="lg:col-span-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
                  const isInCart = cartItems.some((item) => item.product_id === product.id);

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 flex flex-col h-full relative"
                    >
                      {/* IMAGE AREA */}
                      <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* ABSOLUTE FLOATING QUICK WISHLIST BUTTON */}
                        <button
                          onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all duration-200 transform active:scale-90 ${
                            isWishlisted 
                              ? "bg-rose-50 border-rose-100 text-rose-500" 
                              : "bg-white/80 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-white"
                          }`}
                        >
                          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* DATA CARD FOOTER */}
                      <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-violet-600">
                            {product.brand}
                          </p>
                          <h3 className="font-bold text-sm text-[#1a0533] leading-snug line-clamp-2">
                            {product.name}
                          </h3>
                        </div>

                        <div className="space-y-3 pt-2">
                          <p className="text-base font-extrabold text-[#1a0533]">
                            ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                          </p>

                          {/* ACTION BUTTON WRAPPER */}
                          <div className="flex gap-2 w-full pt-1">
                            <button
                              disabled={isInCart}
                              onClick={() => addToCart(product)}
                              className={`flex-1 text-xs font-bold uppercase tracking-wider rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 border-0 shadow-sm transition-all active:scale-95 disabled:scale-100 ${
                                isInCart
                                  ? "bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-inset ring-emerald-600/10 cursor-not-allowed"
                                  : "bg-slate-900 text-white hover:bg-slate-800"
                              }`}
                            >
                              {isInCart ? "In Cart ✓" : (
                                <>
                                  <ShoppingCart size={14} />
                                  Add Cart
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 shadow-sm transition-colors"
                              title="Quick View"
                            >
                              <Eye size={15} />
                            </button>
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

      {/* ══ MODAL DETAIL QUICKVIEW DIALOG OVERLAY ══ */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#1a0533]/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative border border-slate-100 shadow-2xl space-y-5 animate-scale-up">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm"
            >
              <X size={16} />
            </button>

            <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-extrabold bg-violet-50 text-violet-700 px-2 py-0.5 rounded border border-violet-100">
                {selectedProduct.brand}
              </span>
              <h2 className="text-xl font-black text-[#1a0533] tracking-tight mt-1">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                {selectedProduct.description || "A pristine selection from the curated Lumière line, optimizing long-lasting base formulation properties."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Price Matrix</p>
                <p className="text-lg font-black text-[#1a0533]">
                  ₹{new Intl.NumberFormat("en-IN").format(selectedProduct.price)}
                </p>
              </div>

              <button
                onClick={() => addToCart(selectedProduct)}
                className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-slate-800 border-0 shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <ShoppingCart size={14} />
                Secure to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}