import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useCart from "../context/useCart";
import axios from "axios";
import { animate } from "motion";
import useCartAnimation from "../context/usecartAnimation";
import { Heart } from "lucide-react";
import useWishlist from "../context/useWhishlist";

// Safely access environment variables to prevent esbuild target warnings
const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

function ViewSingleProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { cartPosition } = useCartAnimation();
  const { addToCart, cartItems, increaseQty } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const imgRef = useRef(null);

  // Check if current product is in wishlist
  const isWishlisted = product ? wishlistItems.some((item) => item.id === product.id) : false;

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
  }, [id]);

  const flyToCart = () => {
    if (!imgRef.current || !cartPosition) return;

    const img = imgRef.current;
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

    animate(clone, 
      { x: [0, dx], y: [0, dy], scale: [1, 0.3], opacity: [1, 0] },
      { duration: 0.9, easing: "ease-in-out", onComplete: () => clone.remove() }
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  const stockStatus = product.stock_quantity > 10 ? { label: "In Stock", color: "bg-green-50 text-green-700" } : 
                      product.stock_quantity > 0 ? { label: `Only ${product.stock_quantity} left`, color: "bg-amber-50 text-amber-700" } : 
                      { label: "Out of Stock", color: "bg-red-50 text-red-600" };

  // Find the exact cart item to check quantity
  const cartItem = cartItems.find((item) => item.product_id === product.id || item.id === product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-purple-600 transition">Home</button> / <span className="text-gray-800">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-center items-center rounded-xl p-10 relative" style={{ background: "#EEEDFE", minHeight: "360px" }}>
            <img ref={imgRef} src={product.image_url} alt={product.name} className="w-48 h-48 object-contain" />
            <button 
              onClick={toggleWishlist} 
              className="absolute top-4 right-4 bg-white border border-gray-100 p-2.5 rounded-full hover:bg-gray-50 transition shadow-sm active:scale-95"
            >
              <Heart size={18} className={isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-400"} />
            </button>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-semibold text-gray-900 leading-tight">{product.name}</h1>
            <p className="text-gray-500 font-medium tracking-wide uppercase text-sm mt-1">{product.brand}</p>
            <p className="text-3xl font-bold mt-4 text-purple-900">₹{new Intl.NumberFormat("en-IN").format(product.price)}</p>
            
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
            </div>
            
            <p className="mt-6 text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  if (cartItem && increaseQty) {
                    increaseQty(cartItem);
                  } else {
                    flyToCart();
                    addToCart(product);
                  }
                }}
                disabled={product.stock_quantity === 0}
                className={`px-5 py-3.5 rounded-xl w-full font-bold tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none ${
                  cartItem 
                    ? "bg-green-50 text-green-700 hover:bg-green-100 ring-1 ring-inset ring-green-600/20" 
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                }`}
              >
                {cartItem ? `Added To Cart (${cartItem.quantity}) ✓` : "Add To Cart"}
              </button>
              
              <button 
                onClick={() => { 
                  if (!cartItem) addToCart(product); 
                  navigate("/checkout"); 
                }} 
                disabled={product.stock_quantity === 0} 
                className="border border-gray-200 bg-white px-5 py-3.5 rounded-xl w-full font-bold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
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