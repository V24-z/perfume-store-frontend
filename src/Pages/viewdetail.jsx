import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//import { useAuth } from "../context/useAuth";
import useCart from "../context/useCart";
import axios from "axios";

function ViewSingleProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  //const [addedToCart, setAddedToCart] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  //const {user} = useAuth();
  const { addToCart } = useCart();

  const { id } = useParams();
  const navigate = useNavigate();
  //----get product by id----
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products/by-id/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <p className="text-gray-800 font-medium mb-1">Something went wrong</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const stockStatus =
    product.stock_quantity > 10
      ? { label: "In Stock", color: "bg-green-50 text-green-700" }
      : product.stock_quantity > 0
        ? {
            label: `Only ${product.stock_quantity} left`,
            color: "bg-amber-50 text-amber-700",
          }
        : { label: "Out of Stock", color: "bg-red-50 text-red-600" };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav / breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 py-3 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => navigate("/")}
              className="hover:text-gray-800 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            {product.category?.name && (
              <>
                <button
                  onClick={() => navigate(`/category/${product.category.id}`)}
                  className="hover:text-gray-800 transition-colors capitalize"
                >
                  {product.category.name}
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-gray-800 truncate max-w-[160px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
            {/* ── Image panel ── */}
            <div className="lg:col-span-2 bg-gray-50 flex items-center justify-center p-6 sm:p-10 md:min-h-[420px] border-b md:border-b-0 md:border-r border-gray-100">
              <div className="relative w-full max-w-xs aspect-square">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.name?.[0] ?? "?")}`;
                  }}
                />
                {/* Wishlist button — floats over image */}
                <button
                  onClick={() => setWishlisted((w) => !w)}
                  aria-label={
                    wishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
                >
                  <svg
                    className={`w-5 h-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Detail panel ── */}
            <div className="lg:col-span-3 flex flex-col p-5 sm:p-7 lg:p-8">
              {/* Brand + stock badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${stockStatus.color}`}
                >
                  {stockStatus.label}
                </span>
              </div>

              {/* Product name */}
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug mb-1">
                {product.name}
              </h1>

              {/* Category */}
              {product.category?.name && (
                <p className="text-sm text-gray-400 mb-4 capitalize">
                  {product.category.name}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl sm:text-4xl font-semibold text-gray-900">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>

              <hr className="border-gray-100 mb-5" />

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 flex-1">
                {product.description ?? "No description available."}
              </p>

              {/* Meta chips */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Brand
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {product.brand}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Stock
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {product.stock_quantity} units
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium transition-all duration-150
                ${
                  product.stock_quantity === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#534AB7] text-white hover:bg-[#443da0]"
                }`}
                >
                  Add To Cart
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Add product to cart
                      await addToCart(product);

                      // Redirect to checkout page
                      navigate("/checkout");
                    } catch (error) {
                      console.error("Buy Now Error:", error);
                      alert("Failed to proceed to checkout");
                    }
                  }}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium border transition-all duration-150
                ${
                  product.stock_quantity === 0
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-800 hover:bg-gray-50 active:scale-[0.98]"
                }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Delivery note */}
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                Free delivery on orders above ₹499 · Ships in 1–2 business days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSingleProduct;
