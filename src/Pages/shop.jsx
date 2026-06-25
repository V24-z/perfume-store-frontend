import { useEffect, useState } from "react";
import axios from "axios";

import useCart from "../context/useCart";
import useWishlist from "../context/useWhishlist";

const API_URL = import.meta.env.VITE_API_URL;

export default function Shop() {
  const { addToCart } = useCart();

  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    brand: "",
    max_price: "",
    sort: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== "")
        );

        const { data } = await axios.get(
          `${API_URL}/products`,
          { params: activeFilters }
        );

        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/categories`
        );

        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Shop
      </h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* FILTERS */}

        <div className="border rounded-lg p-4 h-fit">
          <h2 className="font-bold text-lg mb-4">
            Filters
          </h2>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Product"
            value={filters.search}
            onChange={(e) =>
              handleChange(
                "search",
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-4"
          />

          {/* CATEGORY */}

          <select
            value={filters.category_id}
            onChange={(e) =>
              handleChange(
                "category_id",
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* BRAND */}

          <input
            type="text"
            placeholder="Brand"
            value={filters.brand}
            onChange={(e) =>
              handleChange(
                "brand",
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-4"
          />

          {/* MAX PRICE */}

          <input
            type="number"
            placeholder="Max Price"
            value={filters.max_price}
            onChange={(e) =>
              handleChange(
                "max_price",
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-4"
          />

          {/* SORT */}

          <select
            value={filters.sort}
            onChange={(e) =>
              handleChange(
                "sort",
                e.target.value
              )
            }
            className="w-full border p-2 rounded"
          >
            <option value="">
              Sort By
            </option>

            <option value="low">
              Price Low → High
            </option>

            <option value="high">
              Price High → Low
            </option>
          </select>
        </div>

        {/* PRODUCTS */}

        <div className="lg:col-span-3">
          {loading ? (
            <p>Loading Products...</p>
          ) : products.length === 0 ? (
            <p>No Products Found</p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const isWishlisted =
                  wishlistItems.some(
                    (item) =>
                      item.id === product.id
                  );

                return (
                  <div
                    key={product.id}
                    className="border rounded-lg overflow-hidden shadow"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        {product.name}
                      </h3>

                      <p className="text-gray-500">
                        {product.brand}
                      </p>

                      <p className="font-bold mt-2">
                        ₹{product.price}
                      </p>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            addToCart(product)
                          }
                          className="bg-black text-white px-3 py-2 rounded flex-1"
                        >
                          Add Cart
                        </button>

                        <button
                          onClick={() =>
                            setSelectedProduct(
                              product
                            )
                          }
                          className="border px-3 py-2 rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            isWishlisted
                              ? removeFromWishlist(
                                  product.id
                                )
                              : addToWishlist(
                                  product
                                )
                          }
                          className="border px-3 py-2 rounded"
                        >
                          {isWishlisted
                            ? "❤️"
                            : "🤍"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={() =>
                setSelectedProduct(null)
              }
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-full h-80 object-cover rounded"
            />

            <h2 className="text-2xl font-bold mt-4">
              {selectedProduct.name}
            </h2>

            <p className="mt-2 text-gray-600">
              {selectedProduct.description}
            </p>

            <p className="text-xl font-bold mt-4">
              ₹{selectedProduct.price}
            </p>

            <button
              onClick={() =>
                addToCart(selectedProduct)
              }
              className="w-full bg-black text-white py-3 rounded mt-4"
            >
              Add To Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}