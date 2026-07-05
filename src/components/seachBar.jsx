import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null); // Added reference for the portal dropdown
  
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  // 1. Handle user typing synchronously
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };

  // 2. Fetch data only when 'search' changes
  useEffect(() => {
    if (search.trim().length < 2) return;

    const controller = new AbortController();
    let isMounted = true;

    const delayDebounceFn = setTimeout(async () => {
      if (isMounted) setLoading(true);

      try {
        const res = await axios.get(
          `${API_URL}/products/search?q=${encodeURIComponent(search.trim())}`,
          { signal: controller.signal }
        );
        if (isMounted) {
          setSuggestions(res.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (!axios.isCancel(err) && isMounted) {
          console.error("Search error:", err);
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [search]);

  // 3. Adjust dropdown position dynamically (Handles scroll & resize)
  useEffect(() => {
    const updatePosition = () => {
      if (showSuggestions && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    updatePosition(); // Initial calculation

    if (showSuggestions) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true); // true captures scrolling on any parent
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [showSuggestions, suggestions, loading]);

  // 4. Click outside to close (Fixed)
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside both the input wrapper AND the portal dropdown
      const isOutsideWrapper = wrapperRef.current && !wrapperRef.current.contains(e.target);
      const isOutsideDropdown = !dropdownRef.current || !dropdownRef.current.contains(e.target);

      if (isOutsideWrapper && isOutsideDropdown) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      {/* Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          placeholder="Search for fragrances, brands..."
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-12 py-3.5 bg-gray-50/70 backdrop-blur-md border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white text-gray-800"
        />
        
        {/* Right Side Icons (Loading Spinner or Clear Button) */}
        <div className="absolute inset-y-0 right-4 flex items-center">
          {loading ? (
            <svg className="w-5 h-5 text-purple-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : search ? (
            <button 
              onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}
              className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-all cursor-pointer border-0 outline-none focus:ring-2 focus:ring-purple-200"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown Portal */}
      {showSuggestions && createPortal(
        <div
          ref={dropdownRef} // Attached the new ref here
          style={{ 
            position: "fixed", 
            top: dropdownPos.top, 
            left: dropdownPos.left, 
            width: dropdownPos.width, 
            zIndex: 999999 
          }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform origin-top animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {!loading && suggestions.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-sm font-medium">No products found</p>
                <p className="text-gray-400 text-xs">Try searching for a different brand or fragrance.</p>
              </div>
            ) : (
              <div className="p-2">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/viewdetail/${product.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 no-underline group"
                    onClick={() => { setSearch(""); setShowSuggestions(false); }}
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-800 text-sm group-hover:text-purple-700 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        {product.brand}
                      </p>
                    </div>
                    
                    {/* Optional Arrow indicator for better UX */}
                    <svg className="w-4 h-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default SearchBar;