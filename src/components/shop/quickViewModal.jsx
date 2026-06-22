import { X } from "lucide-react";

function QuickViewModal({
  product,
  onClose,
}) {

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          <X />
        </button>

        <div className="grid md:grid-cols-2 gap-6">

          <img
            src={product.image_url}
            alt={product.name}
            className="rounded-xl"
          />

          <div>

            <h2 className="text-2xl font-bold">
              {product.name}
            </h2>

            <p className="text-gray-500">
              {product.brand}
            </p>

            <p className="mt-4">
              {product.description}
            </p>

            <div className="mt-4 text-2xl font-bold">
              ₹{product.price}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default QuickViewModal;