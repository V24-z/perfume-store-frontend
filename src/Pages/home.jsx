import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { animate } from "motion";
import useCart from "../context/useCart";
import useCartAnimation from "../context/usecartAnimation";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5 sm:mb-6 flex items-end justify-between">
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
        {title}
      </h2>
      {subtitle && <p className="text-sm text-[#6B7280] mt-1">{subtitle}</p>}
    </div>
    {/* Amber underline accent */}
    <span className="hidden sm:block h-1 w-12 rounded-full bg-[#FF9900] mb-1" />
  </div>
);

const ProductCard = ({ product, featured = false, setImageRef, flyToCart, addToCart }) => {
  const hasDiscount = product.discount_price > 0;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F8FAFC]" style={{ aspectRatio: "4/3" }}>
        <img
          ref={(el) => setImageRef(product.id, el)}
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        {featured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF9900] text-[#111827] tracking-wide">
            FEATURED
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E] text-white">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-1">
        {product.brand && (
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
            {product.brand}
          </p>
        )}
        <h3 className="font-semibold text-sm sm:text-[15px] text-[#111827] leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        {product.fragrance_type && (
          <p className="text-[10px] sm:text-xs text-[#6B7280]">{product.fragrance_type}</p>
        )}

        {/* Pricing — Amazon style */}
        <div className="flex items-baseline gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="font-bold text-base sm:text-lg text-[#B12704]">
                ₹{product.discount_price}
              </span>
              <span className="text-xs text-[#6B7280] line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="font-bold text-base sm:text-lg text-[#B12704]">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* CTA row */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => { flyToCart(product.id); addToCart(product); }}
            aria-label={`Add ${product.name} to cart`}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#FF9900] hover:bg-[#FFB84D] active:scale-95 text-[#111827] transition-all duration-200 shadow-sm shadow-orange-100 shrink-0"
          >
            <ShoppingCart size={18} />
          </button>

          <Link to={`/viewdetail/${product.id}`} className="flex-1">
            <button className="w-full h-11 rounded-xl bg-[#131921] hover:bg-[#232F3E] active:scale-95 text-white text-sm font-semibold transition-all duration-200">
              View Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

function Home() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isPaused, setIsPaused] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const { addToCart } = useCart();
  const { cartPosition } = useCartAnimation();

  const imageRefs = useRef({});
  const setImageRef = (id, el) => { imageRefs.current[id] = el; };
  //==fly to cart animation==
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
    animate(clone, { x: [0, dx], y: [0, dy], scale: [1, 0.8, 0.3], opacity: [1, 1, 0] }, { duration: 0.8, easing: "ease-in-out", onComplete: () => clone.remove() });
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/new-arrivals`);
        setNewArrivals(res.data);
      } catch (err) { console.error(err); }
    };
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/featured/list`);
        setFeaturedProducts(res.data.filter((p) => p.is_featured === true));
      } catch (err) { console.error("Error fetching featured products:", err); }
    };
    getFeaturedProducts();
  }, []);

  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/banners`);
        setBanners(res.data);
      } catch (err) { console.error("Error fetching banners:", err); }
      finally { setLoading(false); }
    };
    getBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => { setDirection("next"); setCurrent((p) => (p + 1) % banners.length); }, 4000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const tick = setInterval(() => {
      setProgress((p) => { if (p >= 100) { clearInterval(tick); return 100; } return p + 100 / 40; });
    }, 100);
    return () => { clearInterval(tick); setProgress(0); };
  }, [current, banners.length, isPaused]);

  const goPrev = useCallback(() => { setDirection("prev"); setCurrent((p) => (p - 1 + banners.length) % banners.length); }, [banners.length]);
  const goNext = useCallback(() => { setDirection("next"); setCurrent((p) => (p + 1) % banners.length); }, [banners.length]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "ArrowLeft") goPrev(); if (e.key === "ArrowRight") goNext(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  const touchStart = useCallback((e) => {
    const x = e.touches[0].clientX;
    const handler = (ev) => { const diff = x - ev.changedTouches[0].clientX; if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev(); document.removeEventListener("touchend", handler); };
    document.addEventListener("touchend", handler, { once: true });
  }, [goNext, goPrev]);
  // ─────────────────────────────────────────────────────────────────────────────

  // ── Loading state ──
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-[40vh] bg-[#F8FAFC]" role="status" aria-label="Loading">
        <div className="w-10 h-10 rounded-full border-[3px] border-[#FF9900] border-t-transparent animate-spin" />
        <p className="text-xs tracking-widest uppercase text-[#6B7280] font-medium">Loading…</p>
      </div>
    );

  return (
    <>
      <style>{`
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn      { from{opacity:0;transform:scale(1.06)} to{opacity:1;transform:scale(1)} }
        .slide-next { animation:slideInRight 0.55s cubic-bezier(.22,.68,0,1.1) both }
        .slide-prev { animation:slideInLeft  0.55s cubic-bezier(.22,.68,0,1.1) both }
        .img-zoom   { animation:scaleIn      0.7s  cubic-bezier(.22,.68,0,1.1) both }
        .c-tag   { animation:fadeUp 0.5s 0.08s ease both }
        .c-title { animation:fadeUp 0.5s 0.18s ease both }
        .c-sub   { animation:fadeUp 0.5s 0.28s ease both }
        .c-btn   { animation:fadeUp 0.5s 0.38s ease both }
        .slide-ctrl:focus-visible { outline:2px solid #FF9900; outline-offset:2px }
        @media (prefers-reduced-motion:reduce) {
          .slide-next,.slide-prev,.img-zoom,.c-tag,.c-title,.c-sub,.c-btn { animation:none!important;opacity:1!important;transform:none!important }
        }
      `}</style>

      {/* ── Page shell ── */}
      <main className="w-full bg-[#F8FAFC] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-10 sm:space-y-12 md:space-y-14">

          {/* ══════════════════════════
              HERO BANNER CAROUSEL
          ══════════════════════════ */}
          <section aria-label="Featured banners">
            {banners.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl gap-3 min-h-[200px] border border-dashed border-[#E5E7EB] bg-white">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-400">No banners available</p>
              </div>
            ) : (
              <div
                role="region"
                aria-label="Banner carousel"
                aria-roledescription="carousel"
                className="relative w-full rounded-2xl overflow-hidden bg-[#131921]
                           aspect-[3/2] sm:aspect-[16/9] md:aspect-[21/9]
                           min-h-[160px] sm:min-h-[220px] max-h-[500px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={touchStart}
              >
                {banners.map((banner, i) => (
                  <div
                    key={banner.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Slide ${i + 1} of ${banners.length}: ${banner.title}`}
                    aria-hidden={i !== current}
                    className={`absolute inset-0 ${i === current ? (direction === "next" ? "slide-next" : "slide-prev") : ""}`}
                    style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none", zIndex: i === current ? 2 : 1 }}
                  >
                    {banner.image_url && (
                      <img key={`img-${i}-${current}`} src={banner.image_url} alt="" aria-hidden="true" className="w-full h-full object-cover img-zoom" />
                    )}

                    {/* ── Dark ecommerce overlay (replaces purple) ── */}
                    <div className="absolute inset-0" aria-hidden="true"
                      style={{ background: "linear-gradient(to right,rgba(19,25,33,0.88) 0%,rgba(19,25,33,0.55) 50%,rgba(19,25,33,0.1) 100%)" }} />
                    <div className="absolute inset-0" aria-hidden="true"
                      style={{ background: "linear-gradient(to top,rgba(19,25,33,0.6) 0%,transparent 55%)" }} />

                    {/* Slide content */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full px-4 sm:px-10 md:px-14 lg:px-20" style={{ maxWidth: "min(600px,65%)" }}>
                      <p className="c-tag mb-2 font-semibold tracking-[0.18em] uppercase text-[#FF9900] text-[9px] sm:text-[10px] md:text-xs">
                        ✦ &nbsp;Premium Collection
                      </p>
                      <h2 className="c-title text-white leading-tight mb-2 font-bold text-base sm:text-2xl md:text-3xl lg:text-4xl">
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p className="c-sub mb-4 sm:mb-6 leading-relaxed text-white/70 text-[11px] sm:text-xs md:text-sm">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.button_text && (
                        <a
                          key={`btn-${i}`}
                          href={banner.button_link || "#"}
                          className="c-btn inline-flex items-center gap-2 rounded-xl no-underline font-bold
                                     transition-all duration-200 hover:scale-105 active:scale-95
                                     bg-[#FF9900] hover:bg-[#FFB84D] text-[#111827]
                                     text-[10px] sm:text-xs md:text-sm
                                     px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3
                                     shadow-lg shadow-orange-900/30"
                        >
                          {banner.button_text}
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Slide counter */}
                    <div aria-hidden="true" className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full px-2.5 py-1 z-10 bg-black/40 border border-white/15 text-white/75 font-medium text-[10px] sm:text-xs">
                      {i + 1} / {banners.length}
                    </div>
                  </div>
                ))}

                {/* Pause pill */}
                {isPaused && banners.length > 1 && (
                  <div aria-hidden="true" className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 z-10 hidden sm:block bg-black/40 border border-white/15 text-white/60 text-[10px]">
                    ⏸ Paused
                  </div>
                )}

                {/* ── Prev / Next — white circle controls (Amazon-style) ── */}
                {banners.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      aria-label={`Previous slide, ${current + 1} of ${banners.length}`}
                      className="slide-ctrl absolute top-1/2 -translate-y-1/2 z-10 left-2 sm:left-4
                                 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer
                                 bg-white/90 hover:bg-white text-[#131921] shadow-md
                                 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={goNext}
                      aria-label={`Next slide, ${current + 1} of ${banners.length}`}
                      className="slide-ctrl absolute top-1/2 -translate-y-1/2 z-10 right-2 sm:right-4
                                 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer
                                 bg-white/90 hover:bg-white text-[#131921] shadow-md
                                 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Progress bar — amber */}
                <div aria-hidden="true" className="absolute bottom-0 left-0 h-[3px] z-10 transition-[width] duration-100 linear"
                  style={{ background: "linear-gradient(to right,#FF9900,#FFB84D)", width: `${progress}%` }} />
              </div>
            )}
          </section>

          {/* ══════════════════════════
              FEATURED PRODUCTS
          ══════════════════════════ */}
          <section aria-label="Featured Perfumes">
            <SectionHeader title="Featured Perfumes" subtitle='Handpicked products marked as "Featured"' />

            {featuredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E5E7EB]">
                <p className="text-[#6B7280]">No featured perfumes available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} featured setImageRef={setImageRef} flyToCart={flyToCart} addToCart={addToCart} />
                ))}
              </div>
            )}
          </section>

          {/* ══════════════════════════
              NEW ARRIVALS
          ══════════════════════════ */}
          <section aria-label="New Arrivals">
            <SectionHeader title="New Arrivals" subtitle="Recently added to our collection" />

            {newArrivals.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E5E7EB]">
                <p className="text-[#6B7280]">No new arrivals yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} setImageRef={setImageRef} flyToCart={flyToCart} addToCart={addToCart} />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  );
}

export default Home;