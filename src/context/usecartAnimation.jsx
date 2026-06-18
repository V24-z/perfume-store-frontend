import { useContext } from "react";
import { CartAnimationContext } from "./cart_animation_context";

const useCartAnimation = () => {
  return useContext(CartAnimationContext);
};

export default useCartAnimation;