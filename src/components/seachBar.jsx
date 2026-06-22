import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// SEARCHBAR — Premium Ecommerce Redesign
// All logic, hooks, API calls, debounce, state, routes unchanged.
// Only UI/UX improved:
//  • White pill input (Amazon-style) replaces translucent dark pill
//  • Orange focus ring + icon color shift
//  • Dropdown: white card, xl shadow, structured product rows
//  • Price: #FF9900 (orange) replaces purple-600
//  • Hover: orange-50 bg + image scale micro-interaction
// ─────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL;

function SearchBar() {
  // ── State (100% unchanged) ─────────────────────────────────
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ── Debounced search (100% unchanged) ─────────────────────
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/products/search?q=${search}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    // Container: expands to fill flex-1 space given by Header,
    // capped at 700px on large screens (Amazon search width)
    <div className="relative w-full max-w-[700px]">

      {/* ── Search input pill ───────────────────────────────────
          White background replaces the translucent dark pill.
          Rounded-full → ecommerce pill shape.
          Orange focus ring on the wrapper (not the input) so the
          full pill highlights — matches Amazon/Myntra behavior.
          onMouseEnter/Leave removed; focus state handles the
          visual affordance entirely.
      ──────────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-2 bg-white rounded-full px-4 py-2.5
                    border-2 transition-all duration-200
                    ${showSuggestions && search
                      ? "border-[#FF9900] shadow-[0_0_0_3px_rgba(255,153,0,0.15)]"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
      >
        {/* Search icon — gray by default, orange when active */}
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-colors duration-200
                      ${showSuggestions && search ? "text-[#FF9900]" : "text-gray-400"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input — dark text on white, gray placeholder */}
        <input
          type="text"
          placeholder="Search for products, brands and more..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay so Link clicks inside dropdown register first
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="bg-transparent w-full text-gray-900 placeholder:text-gray-400
                     text-sm focus:outline-none min-w-0"
        />

        {/* Clear button — visible only when there is a query */}
        {search && (
          <button
            onMouseDown={(e) => {
              // Prevent blur from firing before clear
              e.preventDefault();
              setSearch("");
              setSuggestions([]);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-150 cursor-pointer"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Suggestion dropdown ─────────────────────────────────
          White card, xl shadow, subtle gray border.
          max-h-[420px] + overflow-y-auto for long result lists.
          mt-2 gap separates it from the input pill.
      ──────────────────────────────────────────────────────── */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2
                     bg-white rounded-2xl border border-gray-200
                     shadow-[0_8px_40px_rgba(0,0,0,0.14)]
                     z-50 overflow-hidden max-h-[420px] overflow-y-auto"
        >
          {/* Dropdown header label (Myntra/Flipkart pattern) */}
          <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Search Results
            </p>
          </div>

          {/* Product suggestion rows */}
          {suggestions.map((product) => (
            <Link
              key={product.id}
              to={`/viewdetail/${product.id}`}
              className="flex items-center gap-3.5 px-4 py-3
                         hover:bg-orange-50 transition-colors duration-150
                         border-b border-gray-50 last:border-0 no-underline group"
              onClick={() => {
                // Logic unchanged
                setSearch("");
                setShowSuggestions(false);
              }}
            >
              {/* Product image — consistent 48×48, rounded, subtle border */}
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {product.brand}
                </p>
                {/* Price: orange replaces purple — consistent with accent system */}
                <p className="text-sm font-bold text-[#FF9900] mt-0.5">
                  ₹{product.price}
                </p>
              </div>

              {/* Chevron affordance — subtle, appears on hover */}
              <svg
                className="w-4 h-4 text-gray-300 group-hover:text-[#FF9900] flex-shrink-0 transition-colors duration-150"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;