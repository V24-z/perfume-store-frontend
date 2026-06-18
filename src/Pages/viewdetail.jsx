import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useCart from "../context/useCart";
import axios from "axios";
import { animate } from "motion";
import useCartAnimation from "../context/usecartAnimation";

function ViewSingleProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const { cartPosition } = useCartAnimation();
  const API_URL = import.meta.env.VITE_API_URL;
  const { addToCart } = useCart();

  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ ref for animation
  const imgRef = useRef(null);

  // ─── FETCH PRODUCT ───
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

  // ─── LOADING UI ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  // ─── ERROR UI ───
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
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

  // ─── ANIMATION FUNCTION ───

  const flyToCart = () => {
    console.log("cartPosition:", cartPosition);

    if (!imgRef.current || !cartPosition) {
      console.log("Animation blocked");
      return;
    }

    const img = imgRef.current;
    const rect = img.getBoundingClientRect();

    // Clone image
    const clone = img.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = "999999";
    clone.style.pointerEvents = "none";
    clone.style.willChange = "transform";

    document.body.appendChild(clone);

    // Start from image center
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Move toward cart center
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
        duration: 0.9,
        easing: "ease-in-out",
        onComplete: () => {
          clone.remove();
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── BREADCRUMB ─── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500">
          <button onClick={() => navigate("/")}>Home</button> /{" "}
          <span className="text-gray-800">{product.name}</span>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl">
          {/* ─── IMAGE ─── */}
          <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6 relative">
            <img
              ref={imgRef}
              src={product.image_url}
              alt={product.name}
              className="w-64 h-64 object-contain"
            />

            {/* Wishlist */}
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
            >
              ❤️
            </button>
          </div>

          {/* ─── DETAILS ─── */}
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-500">{product.brand}</p>

            <p className="text-3xl font-bold mt-4">₹{product.price}</p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${stockStatus.color}`}
            >
              {stockStatus.label}
            </span>

            <p className="mt-6 text-gray-600">{product.description}</p>

            {/* ─── BUTTONS ─── */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  flyToCart(); // 🔥 animation
                  addToCart(product);
                }}
                disabled={product.stock_quantity === 0}
                className="bg-purple-600 text-white px-5 py-3 rounded-xl w-full disabled:opacity-50"
              >
                Add To Cart
              </button>

              <button
                onClick={async () => {
                  await addToCart(product);
                  navigate("/checkout");
                }}
                disabled={product.stock_quantity === 0}
                className="border px-5 py-3 rounded-xl w-full"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSingleProduct;
