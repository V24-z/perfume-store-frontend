import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { animate } from "motion";
import useCart from "../context/useCart";
import useCartAnimation from "../context/usecartAnimation";
const API_URL = import.meta.env.VITE_API_URL;

import { Link } from "react-router-dom";
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

    animate(
      clone,
      {
        x: [0, dx],
        y: [0, dy],
        scale: [1, 0.8, 0.3],
        opacity: [1, 1, 0],
      },
      {
        duration: 0.8,
        easing: "ease-in-out",
        onComplete: () => clone.remove(),
      },
    );
  };
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/new-arrivals`);
        setNewArrivals(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/featured/list`);
        setFeaturedProducts(res.data.filter((p) => p.is_featured === true));
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    getFeaturedProducts();
  }, []);

  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/banners`);
        setBanners(res.data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };
    getBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setDirection("next");
      setCurrent((p) => (p + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(tick);
          return 100;
        }
        return p + 100 / 40;
      });
    }, 100);
    return () => {
      clearInterval(tick);
      setProgress(0);
    };
  }, [current, banners.length, isPaused]);

  //const goTo = useCallback(
  //  (i) => {
  //   setDirection(i > current ? "next" : "prev");
  //   setCurrent(i);
  // },
  //[current],
  //);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrent((p) => (p + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  const touchStart = useCallback(
    (e) => {
      const x = e.touches[0].clientX;
      const handler = (ev) => {
        const diff = x - ev.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
        document.removeEventListener("touchend", handler);
      };
      document.addEventListener("touchend", handler, { once: true });
    },
    [goNext, goPrev],
  );

  if (loading)
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 min-h-[40vh]"
        role="status"
        aria-label="Loading banners"
      >
        <div className="w-10 h-10 rounded-full border-2 animate-spin border-[#534AB7] border-t-transparent" />
        <p className="text-xs tracking-widest uppercase text-[#534AB7]">
          Loading...
        </p>
      </div>
    );

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(40px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-40px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(1.06); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow:0 0 0 0   rgba(253,224,71,0.45); }
          50%      { box-shadow:0 0 0 8px rgba(253,224,71,0); }
        }
        .slide-next { animation:slideInRight 0.55s cubic-bezier(.22,.68,0,1.1) both; }
        .slide-prev { animation:slideInLeft  0.55s cubic-bezier(.22,.68,0,1.1) both; }
        .img-zoom   { animation:scaleIn      0.7s  cubic-bezier(.22,.68,0,1.1) both; }
        .c-tag      { animation:fadeUp 0.5s 0.08s ease both; }
        .c-title    { animation:fadeUp 0.5s 0.18s ease both; }
        .c-sub      { animation:fadeUp 0.5s 0.28s ease both; }
        .c-btn      { animation:fadeUp 0.5s 0.38s ease both; }
        .glow-btn   { animation:pulseGlow 2s infinite; }
        .feat-1     { animation:fadeUp 0.5s 0.05s ease both; }
        .feat-2     { animation:fadeUp 0.5s 0.15s ease both; }
        .feat-3     { animation:fadeUp 0.5s 0.25s ease both; }
        .slide-ctrl:focus-visible { outline:2px solid #fde047; outline-offset:2px; }
        @media (prefers-reduced-motion: reduce) {
          .slide-next,.slide-prev,.img-zoom,
          .c-tag,.c-title,.c-sub,.c-btn,
          .feat-1,.feat-2,.feat-3 {
            animation:none !important;
            opacity:1 !important;
            transform:none !important;
          }
        }
      `}</style>

      {/* ── Page wrapper — centres content, consistent horizontal padding ── */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 md:py-8 space-y-8 sm:space-y-10 md:space-y-12">
        {/* ════════════════════════════════
            BANNER CAROUSEL
        ════════════════════════════════ */}
        <section aria-label="Featured banners">
          {banners.length === 0 ? (
            <div
              role="img"
              aria-label="No banners available"
              className="flex flex-col items-center justify-center rounded-2xl gap-3 min-h-[200px] sm:min-h-[240px] border border-dashed border-[#e5e0f0]"
            >
              <svg
                className="w-10 h-10 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-300 tracking-wide">
                No banners available
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {/* Main carousel */}
              <div
                role="region"
                aria-label="Banner carousel"
                aria-roledescription="carousel"
                className="relative w-full rounded-2xl overflow-hidden bg-[#1a0533]
                           aspect-[3/2] sm:aspect-[16/9] md:aspect-[21/9]
                           min-h-[160px] sm:min-h-[220px] max-h-[480px]"
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
                    style={{
                      opacity: i === current ? 1 : 0,
                      pointerEvents: i === current ? "auto" : "none",
                      zIndex: i === current ? 2 : 1,
                    }}
                  >
                    {banner.image_url && (
                      <img
                        key={`img-${i}-${current}`}
                        src={banner.image_url}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover img-zoom"
                      />
                    )}

                    {/* Gradient overlays — arbitrary color stops, must stay inline */}
                    <div
                      className="absolute inset-0"
                      aria-hidden="true"
                      style={{
                        background:
                          "linear-gradient(to right,rgba(26,5,51,0.92) 0%,rgba(26,5,51,0.55) 45%,rgba(26,5,51,0.08) 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      aria-hidden="true"
                      style={{
                        background:
                          "linear-gradient(to top,rgba(26,5,51,0.65) 0%,transparent 55%)",
                      }}
                    />

                    {/* Slide content — max-width via inline (no Tailwind equiv for min()) */}
                    <div
                      className="absolute top-1/2 left-0 -translate-y-1/2 w-full
                                 px-4 sm:px-8 md:px-12 lg:px-16"
                      style={{ maxWidth: "min(580px, 65%)" }}
                    >
                      <p
                        key={`tag-${i}`}
                        className="c-tag mb-1.5 sm:mb-2 font-medium tracking-[0.16em] uppercase text-[#fde047] text-[9px] sm:text-[10px] md:text-[11px]"
                      >
                        ◈ &nbsp;Lumière Parfum
                      </p>
                      <h2
                        key={`title-${i}`}
                        className="c-title text-white leading-tight mb-1.5 sm:mb-2 font-semibold
                                   text-base sm:text-2xl md:text-3xl lg:text-4xl"
                      >
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p
                          key={`sub-${i}`}
                          className="c-sub mb-3 sm:mb-5 leading-relaxed text-white/65
                                     text-[11px] sm:text-xs md:text-sm"
                        >
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.button_text && (
                        <a
                          key={`btn-${i}`}
                          href={banner.button_link || "#"}
                          className="c-btn glow-btn inline-flex items-center gap-1.5 rounded-full no-underline font-semibold
                                     transition-all hover:scale-105 active:scale-95
                                     bg-[#fde047] text-[#1a0533]
                                     text-[10px] sm:text-xs
                                     px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5"
                        >
                          {banner.button_text}
                          <svg
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Counter badge */}
                    <div
                      aria-hidden="true"
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4
                                 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 z-10
                                 bg-white/10 border border-white/20 text-white/80 font-medium
                                 text-[9px] sm:text-[10px] md:text-[11px]"
                    >
                      {i + 1} / {banners.length}
                    </div>
                  </div>
                ))}

                {/* Pause indicator */}
                {isPaused && banners.length > 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 z-10
                               hidden sm:block bg-black/35 border border-white/15 text-white/60 text-[10px]"
                  >
                    ⏸ Paused
                  </div>
                )}

                {/* Prev / Next buttons */}
                {banners.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      aria-label={`Previous slide, currently on slide ${current + 1} of ${banners.length}`}
                      className="slide-ctrl absolute top-1/2 -translate-y-1/2 z-10 left-2 sm:left-3 md:left-4
                                 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10
                                 rounded-full flex items-center justify-center cursor-pointer
                                 transition-all hover:scale-110 active:scale-95
                                 bg-white/10 hover:bg-white/25 border border-white/25 text-white"
                    >
                      <svg
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={goNext}
                      aria-label={`Next slide, currently on slide ${current + 1} of ${banners.length}`}
                      className="slide-ctrl absolute top-1/2 -translate-y-1/2 z-10 right-2 sm:right-3 md:right-4
                                 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10
                                 rounded-full flex items-center justify-center cursor-pointer
                                 transition-all hover:scale-110 active:scale-95
                                 bg-white/10 hover:bg-white/25 border border-white/25 text-white"
                    >
                      <svg
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Dot indicators 
                {banners.length > 1 && (
                  <div
                    role="tablist"
                    aria-label="Slide navigation"
                    className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10"
                  >
                    {banners.map((b, i) => (
                      <button
                        key={i}
                        role="tab"
                        aria-selected={i === current}
                        aria-label={`Go to slide ${i + 1}: ${b.title}`}
                        onClick={() => goTo(i)}
                        className="slide-ctrl rounded-full border-0 cursor-pointer transition-all duration-300"
                        style={{
                          width:
                            i === current
                              ? "clamp(14px,2.5vw,20px)"
                              : "clamp(4px,0.8vw,6px)",
                          height: "clamp(4px,0.8vw,6px)",
                          background:
                            i === current
                              ? "#fde047"
                              : "rgba(255,255,255,0.35)",
                        }}
                      />
                    ))}
                  </div>
                )}*/}

                {/* Progress bar */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 z-10 transition-[width] duration-100 linear"
                  style={{
                    background: "linear-gradient(to right,#fde047,#f59e0b)",
                    width: `${progress}%`,
                  }}
                />
              </div>

              {/* Thumbnail strip — sm+ only 
              {banners.length > 1 && (
                <div
                  role="list"
                  aria-label="Slide thumbnails"
                  className="hidden sm:flex gap-2 sm:gap-2.5"
                >
                  {banners.map((banner, i) => (
                    <button
                      key={banner.id}
                      role="listitem"
                      onClick={() => goTo(i)}
                      aria-label={`Jump to slide ${i + 1}: ${banner.title}`}
                      aria-current={i === current ? "true" : undefined}
                      className={`slide-ctrl flex-1 min-w-0 relative rounded-xl overflow-hidden cursor-pointer border-0
                                  transition-all duration-300 h-12 sm:h-14 md:h-[72px]
                                  ${
                                    i === current
                                      ? "border-2 border-[#534AB7] opacity-100 shadow-[0_0_0_3px_rgba(83,74,183,0.2)]"
                                      : "border-2 border-transparent opacity-60 hover:opacity-90 hover:scale-[1.03]"
                                  }`}
                    >
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1a0533]" />
                      )}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-end px-1.5 sm:px-2 pb-1 sm:pb-1.5"
                        style={{
                          background:
                            "linear-gradient(transparent 20%,rgba(26,5,51,0.82))",
                        }}
                      >
                        <p className="text-white truncate w-full text-left leading-tight font-medium text-[9px] sm:text-[10px]">
                          {banner.title}
                        </p>
                      </div>
                      {i === current && (
                        <div
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fde047]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}*/}

              {/* Mobile dot strip — xs only 
              {banners.length > 1 && (
                <div className="flex sm:hidden gap-1.5 justify-center pt-1">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Slide ${i + 1}`}
                      className="rounded-full border-0 cursor-pointer transition-all duration-300"
                      style={{
                        width: i === current ? 18 : 6,
                        height: 6,
                        background: i === current ? "#534AB7" : "#e5e0f0",
                      }}
                    />
                  ))}
                </div>
              )}*/}
            </div>
          )}
        </section>

        {/* ════════════════════════════════
            FEATURED PERFUMES
        ════════════════════════════════ */}
        <section aria-label="Featured Perfumes">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a0533]">
              Featured Perfumes
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Selected products marked as "Featured"
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200">
              <p className="text-gray-500">No featured perfumes available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-36 sm:h-44 md:h-52 lg:h-60 xl:h-64 bg-slate-100">
                    <img
                      ref={(el) => (imageRefs.current[product.id] = el)}
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 sm:py-1
                                     rounded-full text-[9px] sm:text-[10px] font-bold bg-[#534AB7] text-white"
                    >
                      FEATURED
                    </span>
                  </div>

                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs text-purple-700 font-semibold uppercase">
                      {product.brand}
                    </p>
                    <h3 className="font-bold mt-0.5 sm:mt-1 text-sm sm:text-base text-[#1a0533] leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    {product.fragrance_type && (
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                        {product.fragrance_type}
                      </p>
                    )}

                    <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {product.discount_price > 0 ? (
                        <>
                          <span className="font-bold text-base sm:text-lg text-purple-900">
                            ₹{product.discount_price}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-base sm:text-lg text-purple-900">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          flyToCart(product.id);
                          addToCart(product);
                        }}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 text-[#534AB7] hover:bg-purple-200 transition"
                      >
                        <ShoppingCart size={20} />
                      </button>

                      <Link to={`/viewdetail/${product.id}`} className="flex-1">
                        <button className="w-full h-12 rounded-xl bg-[#534AB7] text-white font-semibold hover:bg-[#443da0] transition">
                          View Detail
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════════════════
            NEW ARRIVALS
        ════════════════════════════════ */}
        <section aria-label="New Arrivals">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a0533]">
              New Arrivals
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 sm:mt-1">
              Recently added perfumes
            </p>
          </div>

          {newArrivals.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200">
              <p className="text-gray-500">No new arrivals yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {newArrivals.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100"
                >
                  <div className="h-36 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-[#1a0533] leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                      {product.brand}
                    </p>
                    <p className="font-bold text-indigo-600 mt-1.5 sm:mt-2 text-sm sm:text-base">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Home;
