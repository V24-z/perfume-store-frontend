
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

const API_URL = import.meta.env.VITE_API_URL;

function SearchBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef(null);

  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/products/search?q=${search}`
        );

        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const updateDropdownPosition = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();

    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!showSuggestions) return;

    updateDropdownPosition();

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition);
    };
  }, [showSuggestions]);

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative w-56 lg:w-72"
      >
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 transition-all"
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.20)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "rgba(255,255,255,0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "rgba(255,255,255,0.10)")
          }
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "rgba(255,255,255,0.50)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search fragrances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              updateDropdownPosition();
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false);
              }, 200);
            }}
            className="bg-transparent w-full text-white placeholder:text-white/40 text-sm focus:outline-none"
          />
        </div>
      </div>

      {showSuggestions &&
        suggestions.length > 0 &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 999999,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto"
          >
            {suggestions.map((product) => (
              <Link
                key={product.id}
                to={`/viewdetail/${product.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 transition no-underline"
                onClick={() => {
                  setSearch("");
                  setShowSuggestions(false);
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />

                <div>
                  <p className="font-medium text-gray-900">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {product.brand}
                  </p>

                  <p className="text-xs text-purple-600">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

export default SearchBar;
