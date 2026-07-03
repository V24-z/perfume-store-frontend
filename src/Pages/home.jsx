import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { ShoppingCart, Heart } from "lucide-react";
import { animate } from "motion";
import { Link } from "react-router-dom";
import useCart from "../context/useCart";
import useCartAnimation from "../context/usecartAnimation";
import useWishlist from "../context/useWhishlist";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  // REMOVED: const [direction, setDirection] = useState("next"); // Was unused
  const [isPaused, setIsPaused] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const { addToCart, cartItems, increaseQty } = useCart();
  const { cartPosition } = useCartAnimation();

  const imageRefs = useRef({});
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const [processingId, setProcessingId] = useState(null);

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
    clone.style.borderRadius = "12px";
    document.body.appendChild(clone);

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const dx = cartPosition.x - startX;
    const dy = cartPosition.y - startY;

    animate(
      clone,
      { x: [0, dx], y: [0, dy], scale: [1, 0.2], opacity: [1, 0] },
      { duration: 0.8, easing: "ease-in-out", onComplete: () => clone.remove() }
    );
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

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setProgress(0);
  };

  useEffect(() => {
    let progressInterval;
    if (!loading && banners.length > 0 && !isPaused) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(progressInterval);
  }, [loading, banners.length, isPaused, nextSlide]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, newArrivalsRes, featuredRes] = await Promise.all([
          axios.get(`${API_URL}/banners`),
          axios.get(`${API_URL}/products?sort=newest&limit=4`),
          axios.get(`${API_URL}/products?is_featured=true&limit=4`),
        ]);
        setBanners(bannerRes.data || []);
        setNewArrivals(newArrivalsRes.data?.data || []);
        setFeaturedProducts(featuredRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 sm:pb-16 lg:pb-20">
      {/* ── HERO CAROUSEL ── */}
      {banners.length > 0 && (
        <div
          className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <p className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-2 sm:mb-4">
                  {banner.subtitle}
                </p>
                <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 max-w-4xl leading-tight">
                  {banner.title}
                </h1>
                {banner.button_link && (
                  <Link
                    to={banner.button_link}
                    className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold tracking-wide hover:bg-gray-100 transition-all transform hover:scale-105"
                  >
                    {banner.button_text || "Explore Now"}
                  </Link>
                )}
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-30 flex flex-col items-center gap-4">
            <div className="flex gap-4">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrent(idx);
                    setProgress(0);
                  }}
                  className={`w-10 sm:w-16 h-1 rounded-full overflow-hidden bg-white/30 transition-all ${
                    idx === current ? "bg-white/50" : ""
                  }`}
                >
                  {idx === current && (
                    <div
                      className="h-full bg-white transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-4 sm:gap-6 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={prevSlide}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a0533]">
                New Arrivals
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Discover our latest signature scents
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              View All Collection <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {newArrivals.map((product) => {
              const cartItem = cartItems.find(item => item.product_id === product.id);
              const isInCart = !!cartItem;
              const isWishlisted = wishlistItems.some((w) => w.id === product.id);
              const cannotAdd = !isWishlisted && product.stock_quantity <= 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100 relative group"
                >
                  <div className="relative h-36 sm:h-44 md:h-48 lg:h-52 overflow-hidden bg-slate-50">
                    
                    {/* IN STOCK / OUT OF STOCK BADGE */}
                    <div className="absolute top-2 right-2 z-20">
                      {product.stock_quantity > 0 ? (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    
                    {/* WISHLIST BUTTON */}
                    <button
                      onClick={(e) => handleWishlistClick(e, product)}
                      disabled={cannotAdd}
                      className={`absolute top-2 left-2 z-20 p-1.5 sm:p-2 rounded-full shadow-md transition-all ${
                        cannotAdd
                          ? "bg-white/50 text-slate-400 cursor-not-allowed"
                          : isWishlisted
                          ? "bg-white text-rose-500 hover:bg-rose-50"
                          : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white"
                      }`}
                    >
                      <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
                    </button>

                    <Link to={`/viewdetail/${product.id}`} className="block h-full">
                      <img
                        ref={(el) => (imageRefs.current[product.id] = el)}
                        src={product.image_url}
                        loading="lazy"
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-[#1a0533] leading-snug line-clamp-2">
                      <Link to={`/viewdetail/${product.id}`} className="hover:text-indigo-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                      {product.brand}
                    </p>
                    <p className="font-bold text-indigo-600 mt-1.5 sm:mt-2 text-sm sm:text-base tabular-nums">
                      ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                    </p>

                    <div className="mt-3 sm:mt-4">
                      <button
                        disabled={product.stock_quantity <= 0 || processingId === product.id}
                        onClick={(e) => handleAddToCartClick(e, product)}
                        className={`w-full py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 ${
                          product.stock_quantity <= 0
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : isInCart
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 lg:mt-32">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a0533]">
              Featured Selection
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-indigo-600 mx-auto mt-4 sm:mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {featuredProducts.map((product) => {
              const cartItem = cartItems.find(item => item.product_id === product.id);
              const isInCart = !!cartItem;
              const isWishlisted = wishlistItems.some((w) => w.id === product.id);
              const cannotAdd = !isWishlisted && product.stock_quantity <= 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 transform hover:-translate-y-1 relative group"
                >
                  <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-slate-50">
                    
                    {/* IN STOCK / OUT OF STOCK BADGE */}
                    <div className="absolute top-2 right-2 z-20">
                      {product.stock_quantity > 0 ? (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm pointer-events-none">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* WISHLIST BUTTON */}
                    <button
                      onClick={(e) => handleWishlistClick(e, product)}
                      disabled={cannotAdd}
                      className={`absolute top-2 left-2 z-20 p-1.5 sm:p-2 rounded-full shadow-md transition-all ${
                        cannotAdd
                          ? "bg-white/50 text-slate-400 cursor-not-allowed"
                          : isWishlisted
                          ? "bg-white text-rose-500 hover:bg-rose-50"
                          : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white"
                      }`}
                    >
                      <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
                    </button>

                    <Link to={`/viewdetail/${product.id}`} className="block h-full">
                      <img
                        ref={(el) => (imageRefs.current[product.id] = el)}
                        src={product.image_url}
                        loading="lazy"
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-xs sm:text-sm font-semibold tracking-wider text-indigo-500 uppercase mb-1 sm:mb-2 line-clamp-1">
                      {product.brand}
                    </p>
                    <h3 className="font-bold text-base sm:text-lg text-[#1a0533] leading-tight mb-2 sm:mb-3 line-clamp-2">
                      <Link to={`/viewdetail/${product.id}`} className="hover:text-indigo-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-bold text-lg sm:text-xl text-gray-900 tabular-nums">
                        ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                      </p>
                    </div>

                    <button
                      disabled={product.stock_quantity <= 0 || processingId === product.id}
                      onClick={(e) => handleAddToCartClick(e, product)}
                      className={`mt-4 w-full py-2 sm:py-3 rounded-xl font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 ${
                        product.stock_quantity <= 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : isInCart
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {processingId === product.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      ) : isInCart ? (
                        `In Cart (${cartItem.quantity}) ✓`
                      ) : (
                        <>
                          <ShoppingCart size={16} className="flex-shrink-0" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;