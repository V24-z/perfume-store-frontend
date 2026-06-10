import { useContext } from "react";
import { CartContext } from "./cartcontext";

const useCart = () => {
  return useContext(CartContext);
};

export default useCart;