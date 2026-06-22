function RecentlyViewed({
  products,
}) {

  if (!products.length) return null;

  return (
    <div className="mt-12">

      <h2 className="text-2xl font-bold mb-5">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl p-3"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="rounded-lg"
            />

            <p className="mt-2 font-medium">
              {product.name}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentlyViewed;