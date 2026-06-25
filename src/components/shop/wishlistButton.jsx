import { Heart } from "lucide-react";
import useWishlist from "../../context/useWhishlist";

function WishlistButton({ product }) {
  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const isWishlisted = wishlistItems.some(
    (p) => p.id === product.id
  );

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
    >
      <Heart
        size={18}
        className={
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-gray-500"
        }
      />
    </button>
  );
}

export default WishlistButton;