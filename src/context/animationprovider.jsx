import {useState } from "react";
import {CartAnimationContext} from './cart_animation_context'


export const CartAnimationProvider = ({ children }) => {
  const [cartPosition, setCartPosition] = useState(null);

  return (
    <CartAnimationContext.Provider value={{ cartPosition, setCartPosition }}>
      {children}
    </CartAnimationContext.Provider>
  );
};

