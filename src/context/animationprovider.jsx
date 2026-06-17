import { createContext,useState } from "react";

const CartAnimationContext = createContext();

export const CartAnimationProvider = ({ children }) => {
  const [cartPosition, setCartPosition] = useState(null);

  return (
    <CartAnimationContext.Provider value={{ cartPosition, setCartPosition }}>
      {children}
    </CartAnimationContext.Provider>
  );
};

