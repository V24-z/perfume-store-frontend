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
    
    // Use a variable to track if the effect is cleaned up
    let isMounted = true;

    const delayDebounceFn = setTimeout(async () => {
      // Only set loading if the component is still mounted
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
      isMounted = false; // Prevent state updates after cleanup
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [search]);

  // Adjust dropdown position
  useEffect(() => {
    if (showSuggestions && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [showSuggestions, suggestions, loading]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for fragrances, brands..."
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50/50 backdrop-blur-sm border border-gray-100 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all shadow-sm group-hover:bg-white"
        />
        
        {search && (
          <button 
            onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && createPortal(
        <div
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 999999 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
            ) : suggestions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
            ) : (
              suggestions.map((product) => (
                <Link
                  key={product.id}
                  to={`/viewdetail/${product.id}`}
                  className="block p-3 hover:bg-gray-50 transition no-underline border-b border-gray-50 last:border-0"
                  onClick={() => { setSearch(""); setShowSuggestions(false); }}
                >
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
                </Link>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default SearchBar;