import { useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "./cartcontext";
import { useAuth } from "./useAuth";

const API_URL = import.meta.env.VITE_API_URL;
// Replace later with logged-in user ID

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAuth();
  const USER_ID = user?.id; 
  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/cart/${USER_ID}`
      );

      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch cart error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/cart/${USER_ID}`
      );

      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  
  } ;
   fetchCart();
  }, []);

  // Add item to cart
  const addToCart = async (product) => {
    try {
      await axios.post(`${API_URL}/cart/`, {
        user_id: USER_ID,
        product_id: product.id,
        quantity: 1,
        price: product.price, // only if you added price column
      });

      await fetchCart();
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );
    }
  };

  // Increase quantity
  const increaseQty = async (item) => {
    try {
      await axios.put(`${API_URL}/cart/${item.id}`, {
        quantity: item.quantity + 1,
      });

      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // Decrease quantity
  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await axios.put(`${API_URL}/cart/${item.id}`, {
        quantity: item.quantity - 1,
      });

      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // Remove item
  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`${API_URL}/cart/${cartId}`);

      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await axios.delete(
        `${API_URL}/cart/clear/${USER_ID}`
      );

      setCartItems([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};