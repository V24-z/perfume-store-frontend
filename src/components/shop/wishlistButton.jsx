import { Heart } from "lucide-react";

function WishlistButton({
  product,
  wishlist,
  setWishlist,
}) {

  const toggleWishlist = () => {

    const exists = wishlist.find(
      (p) => p.id === product.id
    );

    if (exists) {
      setWishlist(
        wishlist.filter(
          (p) => p.id !== product.id
        )
      );
    } else {
      setWishlist([...wishlist, product]);
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
          wishlist.find(
            (p) => p.id === product.id
          )
            ? "fill-red-500 text-red-500"
            : "text-gray-500"
        }
      />
    </button>
  );
}

export default WishlistButton;