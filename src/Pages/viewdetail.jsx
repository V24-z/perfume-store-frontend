import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useCart from "../context/useCart";
import axios from "axios";
import { animate } from "motion";
import useCartAnimation from "../context/usecartAnimation";
import { Heart, ShoppingBag, Zap, ChevronLeft } from "lucide-react";
import useWishlist from "../context/useWhishlist";

// Safely access environment variables
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-lg text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">{error}</div>;
  if (!product) return null;

  const stockStatus = product.stock_quantity > 10 ? { label: "In Stock", color: "bg-green-100 text-green-800" } : 
                      product.stock_quantity > 0 ? { label: `Only ${product.stock_quantity} left`, color: "bg-amber-100 text-amber-800" } : 
                      { label: "Out of Stock", color: "bg-red-100 text-red-800" };

  // Find the exact cart item to check quantity
  const cartItem = cartItems.find((item) => item.product_id === product.id || item.id === product.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors font-medium"
        >
          <ChevronLeft size={20} className="mr-1" /> Back to Home
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Image Gallery (Sticky) */}
          <div className="sticky top-24">
            <div className="aspect-square bg-gray-50 rounded-[2.5rem] flex items-center justify-center p-12 overflow-hidden border border-gray-100">
              <img 
                ref={imgRef} 
                src={product.image_url} 
                alt={product.name} 
                className="max-h-full object-contain hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col py-4">
            
            {/* Header / Titles */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-600 font-bold tracking-widest text-xs uppercase">
                  {product.brand}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-semibold text-gray-900">
                ₹{new Intl.NumberFormat("en-IN").format(product.price)}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col gap-4">
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
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none ${
                  cartItem 
                    ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200" 
                    : "bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
                }`}
              >
                <ShoppingBag size={20} />
                {cartItem ? `Added To Cart (${cartItem.quantity}) ✓` : "Add To Cart"}
              </button>
              
              <button 
                onClick={() => { 
                  if (!cartItem) addToCart(product); 
                  navigate("/checkout"); 
                }} 
                disabled={product.stock_quantity === 0}
                className="w-full flex items-center justify-center gap-3 border-2 border-black bg-white text-black py-4 rounded-full font-bold hover:bg-black hover:text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:border-gray-300 disabled:text-gray-400 disabled:pointer-events-none"
              >
                <Zap size={20} /> Buy Now
              </button>
            </div>

            {/* Wishlist Toggle */}
            <button 
              onClick={toggleWishlist}
              className="mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-pink-500 font-medium transition-colors w-max mx-auto md:mx-0"
            >
              <Heart 
                size={22} 
                className={`transition-colors ${isWishlisted ? "fill-pink-500 text-pink-500" : ""}`} 
              /> 
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSingleProduct;