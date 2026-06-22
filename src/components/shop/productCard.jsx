import { ShoppingCart } from "lucide-react";
import RatingStars from "./createRating";
import WishlistButton from "./wishlistButton";

function ProductCard({
  product,
  addToCart,
  wishlist,
  setWishlist,
  openQuickView,
}) {

  return (
    <div className="bg-white rounded-2xl border hover:shadow-xl overflow-hidden">

      <div className="relative">

        <img
          src={product.image_url}
          alt={product.name}
          className="h-64 w-full object-cover"
        />

        <WishlistButton
          product={product}
          wishlist={wishlist}
          setWishlist={setWishlist}
        />

      </div>

      <div className="p-4">

        <p className="text-sm text-gray-500">
          {product.brand}
        </p>

        <h3 className="font-semibold">
          {product.name}
        </h3>

        <RatingStars rating={4} />

        <div className="mt-2 font-bold">
          ₹{product.price}
        </div>

        <div className="flex gap-2 mt-4">

          <button
            onClick={() =>
              addToCart(product)
            }
            className="w-12 h-12 bg-orange-100 rounded-xl"
          >
            <ShoppingCart />
          </button>

          <button
            onClick={() =>
              openQuickView(product)
            }
            className="flex-1 bg-[#131921] text-white rounded-xl"
          >
            Quick View
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;