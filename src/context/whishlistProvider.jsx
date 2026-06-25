import { useState,useEffect } from "react";
import { WishlistContext } from "./whishlistContext";


export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
  const saved = localStorage.getItem("wishlist");

  return saved ? JSON.parse(saved) : [];
});

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);

      if (exists) return prev;

      return [...prev, product];
    });
  };

useEffect(() => {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlistItems)
  );
}, [wishlistItems]);
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};