import { useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "./cartcontext";
import { useAuth } from "./useAuth";

const API_URL = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const USER_ID = user?.id;

  // Fetch Cart
  const fetchCart = async () => {
    if (!USER_ID) return;

    try {
      const { data } = await axios.get(
        `${API_URL}/cart/${USER_ID}`
      );

      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    }
  };

  // Load cart on refresh/login
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    let mounted = true;

    const loadCart = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${API_URL}/cart/${USER_ID}`
        );

        if (mounted) {
          setCartItems(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Load Cart Error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, [USER_ID]);

  // Add To Cart
  const addToCart = async (product) => {
    if (!USER_ID) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(`${API_URL}/cart/`, {
        user_id: USER_ID,
        product_id: product.id,
        quantity: 1,
      });

      await fetchCart();
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error.response?.data || error
      );
    }
  };

  // Increase Quantity
  const increaseQty = async (item) => {
    try {
      await axios.put(`${API_URL}/cart/${item.id}`, {
        quantity: item.quantity + 1,
      });

      await fetchCart();
    } catch (error) {
      console.error(
        "Increase Qty Error:",
        error.response?.data || error
      );
    }
  };

  // Decrease Quantity
  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await axios.put(`${API_URL}/cart/${item.id}`, {
        quantity: item.quantity - 1,
      });

      await fetchCart();
    } catch (error) {
      console.error(
        "Decrease Qty Error:",
        error.response?.data || error
      );
    }
  };

  // Remove Item
  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`${API_URL}/cart/${cartId}`);

      await fetchCart();
    } catch (error) {
      console.error(
        "Remove Item Error:",
        error.response?.data || error
      );
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (!USER_ID) return;

    try {
      await axios.delete(
        `${API_URL}/cart/clear/${USER_ID}`
      );

      setCartItems([]);
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error.response?.data || error
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        fetchCart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};