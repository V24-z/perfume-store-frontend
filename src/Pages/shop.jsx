import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import useCart from "../context/useCart";

const API_URL = import.meta.env.VITE_API_URL;

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/products`);

      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/categories/active/list`
      );

      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadProducts();
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/products/search?q=${search}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/products/category/${selectedCategory}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadProducts();
      await loadCategories();
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    (async () => {
      if (!selectedCategory) {
        await loadProducts();
        return;
      }

      await loadCategoryProducts();
    })();
  }, [selectedCategory]);

  const sortedProducts = useMemo(() => {
    const data = [...products];

    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [products, sort]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#131921]">
            Shop
          </h1>

          <p className="text-gray-500 mt-2">
            Discover our fragrance collection
          </p>
        </div>

        {/* Search + Sort */}

        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">

          <div className="flex flex-col lg:flex-row gap-4">

            <input
              type="text"
              placeholder="Search perfumes..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="h-12 px-4 rounded-xl border border-gray-200"
            >
              <option value="">
                Featured
              </option>

              <option value="low">
                Price Low → High
              </option>

              <option value="high">
                Price High → Low
              </option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar */}

          <aside className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow-sm border p-5 sticky top-24">

              <h2 className="font-bold text-lg mb-4">
                Categories
              </h2>

              <button
                onClick={() =>
                  setSelectedCategory("")
                }
                className={`w-full text-left p-3 rounded-xl mb-2 transition ${
                  !selectedCategory
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                All Products
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(cat.id)
                  }
                  className={`w-full text-left p-3 rounded-xl mb-2 transition ${
                    selectedCategory === cat.id
                      ? "bg-orange-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Products */}

          <section className="lg:col-span-3">

            <div className="flex items-center justify-between mb-4">

              <p className="text-gray-600">
                {sortedProducts.length} Products
              </p>

            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 animate-pulse"
                  >
                    <div className="h-52 bg-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">

                <h3 className="font-semibold text-xl">
                  No Products Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try another search
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition"
                  >
                    <div className="relative h-64">

                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                      {product.is_featured && (
                        <span className="absolute top-3 left-3 bg-[#FF3F6C] text-white text-xs px-3 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-4">

                      <p className="text-sm text-gray-500">
                        {product.brand}
                      </p>

                      <h3 className="font-semibold text-lg mt-1 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mt-3">

                        {product.discount_price > 0 ? (
                          <div className="flex items-center gap-2">

                            <span className="text-xl font-bold text-[#131921]">
                              ₹{product.discount_price}
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-[#131921]">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 mt-5">

                        <button
                          onClick={() =>
                            addToCart(product)
                          }
                          className="w-12 h-12 flex items-center justify-center bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200"
                        >
                          <ShoppingCart size={18} />
                        </button>

                        <Link
                          to={`/viewdetail/${product.id}`}
                          className="flex-1"
                        >
                          <button className="w-full h-12 bg-[#131921] text-white rounded-xl hover:bg-[#232f3e] font-medium">
                            View Detail
                          </button>
                        </Link>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  );
}

export default Shop;