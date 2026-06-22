import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Filter } from "lucide-react";

import useCart from "../context/useCart";

import ProductCard from "../components/shop/productCard";
import FilterSidebar from "../components/shop/filterSidebar";
import MobileFilterDrawer from "../components/shop/mobileFilterDrawer";
import QuickViewModal from "../components/shop/quickViewModal";
import RecentlyViewed from "../components/shop/recentlyViewed";

const API_URL = import.meta.env.VITE_API_URL;

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [maxPrice, setMaxPrice] = useState(10000);

  const [loading, setLoading] = useState(true);

  const [wishlist, setWishlist] = useState([]);

  const [quickView, setQuickView] = useState(null);

  const [mobileFilters, setMobileFilters] =
    useState(false);

  const [recentlyViewed, setRecentlyViewed] =
    useState([]);

  const { addToCart } = useCart();

  // ==========================
  // Products
  // ==========================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/products`
      );

      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Categories
  // ==========================

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

  // ==========================
  // Search
  // ==========================

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

  // ==========================
  // Category
  // ==========================

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

  // ==========================
  // Initial Load
  // ==========================

  useEffect(() => {
    (async () => {
      await loadProducts();
      await loadCategories();
    })();
  }, []);

  // ==========================
  // Search Debounce
  // ==========================

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================
  // Category Change
  // ==========================

  useEffect(() => {
    (async () => {
      if (!selectedCategory) {
        await loadProducts();
        return;
      }

      await loadCategoryProducts();
    })();
  }, [selectedCategory]);

  // ==========================
  // Brands
  // ==========================

  const brands = useMemo(() => {
    return [
      ...new Set(
        products
          .map((p) => p.brand)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  // ==========================
  // Sorting
  // ==========================

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

  // ==========================
  // Final Filters
  // ==========================

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const matchBrand =
        !selectedBrand ||
        product.brand === selectedBrand;

      const matchPrice =
        Number(product.price) <= maxPrice;

      return matchBrand && matchPrice;
    });
  }, [
    sortedProducts,
    selectedBrand,
    maxPrice,
  ]);

  // ==========================
  // Quick View
  // ==========================

  const openQuickView = (product) => {
    setQuickView(product);

    setRecentlyViewed((prev) => {
      const updated = [
        product,
        ...prev.filter(
          (p) => p.id !== product.id
        ),
      ];

      return updated.slice(0, 6);
    });
  };

  return (
    <div className="bg-[#F5F5F6] min-h-screen">

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-[#282C3F]">
            Shop
          </h1>

          <p className="text-gray-500 mt-2">
            Discover premium fragrances
          </p>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl p-4 shadow-sm border mb-6">

          <div className="flex flex-col lg:flex-row gap-4">

            <input
              type="text"
              value={search}
              placeholder="Search perfumes..."
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C]"
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

            <button
              onClick={() =>
                setMobileFilters(true)
              }
              className="lg:hidden h-12 px-4 bg-[#FF3F6C] text-white rounded-xl flex items-center gap-2"
            >
              <Filter size={18} />
              Filters
            </button>

          </div>

        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar */}

          <aside className="hidden lg:block lg:col-span-1">

            <FilterSidebar
              categories={categories}
              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }
              brands={brands}
              selectedBrand={
                selectedBrand
              }
              setSelectedBrand={
                setSelectedBrand
              }
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />

          </aside>

          {/* Products */}

          <section className="lg:col-span-3">

            <div className="flex justify-between mb-5">

              <p className="text-gray-600">
                {filteredProducts.length} Products
              </p>

            </div>

            {loading ? (

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-80 animate-pulse"
                  />
                ))}

              </div>

            ) : filteredProducts.length === 0 ? (

              <div className="bg-white rounded-2xl p-12 text-center">

                <h2 className="font-bold text-2xl">
                  No Products Found
                </h2>

                <p className="text-gray-500 mt-2">
                  Try different filters
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      setWishlist={setWishlist}
                      openQuickView={
                        openQuickView
                      }
                    />
                  )
                )}

              </div>

            )}

          </section>

        </div>

        {/* Recently Viewed */}

        <RecentlyViewed
          products={recentlyViewed}
        />

      </div>

      {/* Mobile Drawer */}

      <MobileFilterDrawer
        open={mobileFilters}
        onClose={() =>
          setMobileFilters(false)
        }
      >

        <FilterSidebar
          categories={categories}
          selectedCategory={
            selectedCategory
          }
          setSelectedCategory={
            setSelectedCategory
          }
          brands={brands}
          selectedBrand={
            selectedBrand
          }
          setSelectedBrand={
            setSelectedBrand
          }
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

      </MobileFilterDrawer>

      {/* Quick View */}

      <QuickViewModal
        product={quickView}
        onClose={() =>
          setQuickView(null)
        }
      />

    </div>
  );
}

export default Shop;