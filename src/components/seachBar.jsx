import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

const API_URL = import.meta.env.VITE_API_URL;

function SearchBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  // 1. Separate state reset into its own effect to avoid cascading logic in the fetch effect
  useEffect(() => {
    if (search.trim().length < 2) {
      // Use a timeout to push this out of the synchronous render phase
      const timer = setTimeout(() => {
        setSuggestions([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [search]);

  // 2. Fetch effect now only handles valid queries
  useEffect(() => {
    if (search.trim().length < 2) return;

    const controller = new AbortController();
    
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/products/search?q=${encodeURIComponent(search.trim())}`,
          { signal: controller.signal }
        );
        setSuggestions(res.data || []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Search Error:", err);
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [search]);

  // ... (rest of your positioning logic remains the same)
  
  const updateDropdownPosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (showSuggestions) {
      updateDropdownPosition();
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition);
      return () => {
        window.removeEventListener("resize", updateDropdownPosition);
        window.removeEventListener("scroll", updateDropdownPosition);
      };
    }
  }, [showSuggestions]);

  return (
    <div ref={wrapperRef} className="relative w-56 lg:w-72">
      <div className="flex items-center gap-2 rounded-full px-4 py-2 border border-white/20 bg-white/10">
        <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search fragrances..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="bg-transparent w-full text-white placeholder:text-white/40 text-sm focus:outline-none"
        />
      </div>

      {showSuggestions && createPortal(
        <div
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 999999 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
          ) : search.trim().length >= 2 && suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((product) => (
              <Link
                key={product.id}
                to={`/viewdetail/${product.id}`}
                className="block p-3 hover:bg-gray-50 transition no-underline"
                onClick={() => { setSearch(""); setShowSuggestions(false); }}
              >
                <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                <p className="text-xs text-gray-500">{product.brand}</p>
              </Link>
            ))
          ) : null}
        </div>,
        document.body
      )}
    </div>
  );
}

export default SearchBar;