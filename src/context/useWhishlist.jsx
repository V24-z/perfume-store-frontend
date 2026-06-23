import { useContext } from "react";
import { WishlistContext } from "./whishlistContext";

export default function useWishlist() {
  return useContext(WishlistContext);
}