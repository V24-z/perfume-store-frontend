import { useContext,  } from "react";
import CartAnimationContext from './cart_animation_context'

//export const useCartAnimation = () => useContext(CartAnimationContext);


const useCartAnimation =()=>{
        return useContext(CartAnimationContext)
}

export default useCartAnimation;