import { useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "./cartcontext";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const USER_ID = user?.id;

  // Fetch Cart from database
  const fetchCart = async () => {
    if (!USER_ID) return;
    try {
      const { data } = await axios.get(`${API_URL}/cart/${USER_ID}`);
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    }
  };

  // Load cart on refresh/login
  useEffect(() => {
    if (!USER_ID) return;
    let mounted = true;

    const loadCart = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/cart/${USER_ID}`);
        if (mounted) setCartItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Load Cart Error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadCart();

    return () => {
      mounted = false;
    };
  }, [USER_ID]);

  // Add to Cart (Optimized for instant UI update)
  const addToCart = async (product) => {
    if (!USER_ID) {
      toast.error("Please login to add items to cart");
      return;
    }
    
    if (product.stock_quantity <= 0) {
      toast.error("Out of stock");
      return;
    }

    const existingItem = cartItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= (product.stock_quantity || existingItem.products?.stock_quantity)) {
        toast.error("Stock not available more");
        return;
      }
      await increaseQty(existingItem);
      return;
    }

    try {
      const payload = {
        user_id: USER_ID,
        product_id: product.id,
        quantity: 1,
      };
      // Use returned data to update state directly avoiding a slow secondary fetch request
      const { data } = await axios.post(`${API_URL}/cart`, payload);
      
      if (data && data.data && data.data.length > 0) {
        const insertedItem = data.data[0];
        setCartItems((prev) => [...prev, {
            id: insertedItem.id,
            product_id: insertedItem.product_id,
            quantity: insertedItem.quantity,
            user_id: insertedItem.user_id,
            products: product
        }]);
      } else {
        await fetchCart();
      }
      toast.success("Added to cart");
    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error("Failed to add item to cart");
    }
  };

  // Increase Quantity (Added Stock Verification)
  const increaseQty = async (item) => {
    const stock = item.products?.stock_quantity || 0;
    if (item.quantity >= stock) {
      toast.error("Stock not available more");
      return;
    }

    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );

    try {
      await axios.put(`${API_URL}/cart/${item.id}`, {
        quantity: item.quantity + 1,
      });
    } catch (error) {
      console.error("Increase Qty Error:", error);
      fetchCart(); // Rollback to server state on error
    }
  };

  // Decrease Quantity
  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;

    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
    );

    try {
      await axios.put(`${API_URL}/cart/${item.id}`, {
        quantity: item.quantity - 1,
      });
    } catch (error) {
      console.error("Decrease Qty Error:", error);
      fetchCart(); // Rollback to server state on error
    }
  };

  // Remove Item
  const removeFromCart = async (cartId) => {
    const previousItems = cartItems;
    setCartItems((prev) => prev.filter((item) => item.id !== cartId));

    try {
      await axios.delete(`${API_URL}/cart/${cartId}`);
    } catch (error) {
      console.error("Remove Item Error:", error);
      setCartItems(previousItems);
    }
  };

  const clearCart = async () => {
    if (!USER_ID) return;
    try {
      await axios.delete(`${API_URL}/cart/clear/${USER_ID}`);
      setCartItems([]);
    } catch (error) {
      console.error("Clear Cart Error:", error);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};