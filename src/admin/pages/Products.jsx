import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  name: "",
  brand: "",
  description: "",
  category_id: "",
  price: "",
  discount_price: "",
  stock_quantity: "",
  volume_ml: "",
  image_url: "",
  fragrance_type: "",
  concentration: "",
  is_featured: false,
};

function StockBadge({ stock }) {
  const stockNum = Number(stock);
  if (stockNum === 0) {
    return (
      <span
        className="text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center"
        style={{ background: "#fcebeb", color: "#A32D2D" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse"></span>
        Out of Stock
      </span>
    );
  }
  if (stockNum <= 5) {
    return (
      <span
        className="text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center"
        style={{ background: "#fff2e6", color: "#C05621" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
        {stockNum} — Low
      </span>
    );
  }
  if (stockNum <= 15) {
    return (
      <span
        className="text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center"
        style={{ background: "#faeeda", color: "#854F0B" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
        {stockNum} — Med
      </span>
    );
  }
  return (
    <span
      className="text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center"
      style={{ background: "#e1f5ee", color: "#0F6E56" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
      {stockNum} — OK
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all"
      style={{ background: "rgba(15, 5, 30, 0.4)" }}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border max-h-[90vh] overflow-y-auto"
        style={{ borderColor: "#f0edf5" }}
      >
        <div
          className="flex items-center justify-between mb-5 sticky top-0 bg-white pb-3 border-b"
          style={{ borderColor: "#f0edf5" }}
        >
          <p className="text-sm font-bold m-0 text-slate-900 tracking-wide uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
            {title}
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-lg leading-none cursor-pointer border-0 bg-transparent p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  // Main live database records
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Table UI states
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal interactions
  const [modal, setModal] = useState(null); // "add" | "edit" | "stock" | "delete"
  const [activeProduct, setActiveProduct] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [stockQty, setStockQty] = useState("");

  // Feedback & network state
  const [actionLoading, setActionLoading] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputCls =
    "w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition mt-1 bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400";
  const labelCls =
    "text-[11px] text-purple-900 font-bold tracking-wider uppercase";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories/`);
        setCategories(res.data);
      } catch (err) {
        console.error("Could not fetch categories from server:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/products/`);
        setProducts(res.data);
      } catch (err) {
        console.error("Could not fetch products from server:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshKey]);

  const triggerMessage = (text) => {
    setSuccessMsg(text);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase());
    const brandMatch = p.brand?.toLowerCase().includes(search.toLowerCase());

    const categoryName =
      p.category?.name || p.category_name || p.category_id || "";
    const catMatch = catFilter
      ? categoryName.toLowerCase() === catFilter.toLowerCase()
      : true;

    return (nameMatch || brandMatch) && catMatch;
  });

  const openAdd = () => {
    setFormData(initialForm);
    setFormErr("");
    setModal("add");
  };

  const openEdit = (product) => {
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      description: product.description || product.discription || "",
      category_id: product.category?.id || product.category_id || "", // ✅ FIX
      price: product.price || "",
      discount_price: product.discount_price || "",
      stock_quantity: product.stock_quantity || "",
      volume_ml: product.volume_ml || "",
      image_url: product.image_url || "",
      fragrance_type: product.fragrance_type || "",
      concentration: product.concentration || "",
      is_featured: product.is_featured || false,
    });

    setActiveProduct(product);
    setFormErr("");
    setModal("edit");
  };

  const openStock = (product) => {
    setActiveProduct(product);
    setStockQty(product.stock_quantity || 0);
    setModal("stock");
  };

  const openDelete = (product) => {
    setActiveProduct(product);
    setModal("delete");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormErr("");

    const { name, brand, price, stock_quantity, category_id } = formData;
    if (
      !name ||
      !brand ||
      price === "" ||
      stock_quantity === "" ||
      !category_id
    ) {
      setFormErr(
        "Name, Brand, Category, Price, and Stock are required fields.",
      );
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discount_price: formData.discount_price
        ? Number(formData.discount_price)
        : 0,
      stock_quantity: Number(formData.stock_quantity),
      volume_ml: formData.volume_ml ? Number(formData.volume_ml) : null,
      category_id: formData.category_id,
    };

    setActionLoading(true);
    
    try {
      if (modal === "edit") {
        axios.put(`${API_BASE_URL}/products/${activeProduct.id}`, payload);
        triggerMessage(`"${payload.name}" updated successfully!`);
      } else {
        await axios.post(`${API_BASE_URL}/products/`, payload);
        triggerMessage(`"${payload.name}" successfully created!`);
      }
      setModal(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
     
        setFormErr(
          error.response?.data?.detail
            ? JSON.stringify(error.response.data.detail)
            : "Error saving record."
        );
      }
     finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStockOnly = async () => {
    const qty = Number(stockQty);
    if (isNaN(qty) || qty < 0) return;

    setActionLoading(true);
    try {
      
      const payload = {
      ...activeProduct,
      stock_quantity: qty,
      category_id: activeProduct.category_id,
    };

      try {
        await axios.patch(`${API_BASE_URL}/products/${activeProduct.id}/`, {
          stock_quantity: qty,
        });
      } catch (patchErr) {
        await axios.put(
          `${API_BASE_URL}/products/${activeProduct.id}/`,
          payload,
          patchErr,
        );
      }

      triggerMessage("Stock updated successfully on server!");
      setModal(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      triggerMessage("Failed to update stock count.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/products/${activeProduct.id}/`);
      triggerMessage(`"${activeProduct.name}" removed from catalogue.`);
      setModal(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      triggerMessage("Could not perform delete action on server.");
    } finally {
      setActionLoading(false);
    }
  };

  // Stats computation directly from API products

  const lowStockCount = products.filter(
    (p) => Number(p.stock_quantity) <= 5 && Number(p.stock_quantity) > 0,
  ).length;
  const outOfStockCount = products.filter(
    (p) => Number(p.stock_quantity) === 0,
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Floating notifications */}
        {successMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-bounce border border-purple-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Dashboard Actions and Main Headers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-xl font-bold m-0" style={{ color: "#1a0533" }}>
              Products
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 mb-0">
              Manage your perfume inventory
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 text-xs font-bold px-5 py-3 rounded-xl text-white transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-lg shadow-purple-950/20 bg-purple-900"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Perfume
          </button>
        </div>

        {/* Interactive Filter Bar & Database Grid */}
        <div
          className="bg-white rounded-2xl overflow-hidden shadow-sm"
          style={{ border: "1px solid #f0edf5" }}
        >
          <div
            className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50/50"
            style={{ borderBottom: "1px solid #f0edf5" }}
          >
            {/* Real-time search */}
            <div className="flex items-center gap-2.5 flex-1 rounded-xl px-4 py-2.5 bg-white border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-purple-600/25 transition-all">
              <svg
                className="w-4 h-4 flex-shrink-0 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                placeholder="Search live directory by name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-xs flex-1 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Live Category select */}
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="text-xs rounded-xl px-4 py-2.5 bg-white border border-slate-200 text-slate-700 cursor-pointer outline-none shadow-sm focus:ring-2 focus:ring-purple-600/25 transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr
                  className="bg-slate-50/75"
                  style={{ borderBottom: "1px solid #f0edf5" }}
                >
                  {[
                    "#",
                    "Product Details",
                    "Category",
                    "Concentration",
                    "Price",
                    "Stock Status",
                    "Actions",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="py-3.5 px-4 text-left font-bold text-slate-400 uppercase tracking-wider text-[10px]"
                      style={{
                        textAlign: [
                          "Price",
                          "Stock Status",
                          "Actions",
                        ].includes(header)
                          ? "center"
                          : "left",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-800 animate-spin"></div>
                        <p className="text-slate-400 text-xs font-semibold">
                          Accessing live database...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="max-w-xs mx-auto">
                        <p className="text-sm font-bold text-slate-800 mb-1">
                          No Perfumes Found
                        </p>
                        <p className="text-xs text-slate-400">
                          Ensure your FastAPI local instance is serving requests
                          properly.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, idx) => {
                    const displayCategory =
                      p.category?.name ||
                      p.category_name ||
                      p.category_id ||
                      "Unassigned";

                    return (
                      <tr
                        key={p.id}
                        className="transition-all hover:bg-slate-50/50"
                        style={{ borderBottom: "1px solid #f9f8fc" }}
                      >
                        <td className="py-4 px-4 text-slate-400 font-medium">
                          {idx + 1}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100 flex items-center justify-center">
                              {p.image_url ? (
                                <img
                                  src={p.image_url}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                    e.target.parentNode.innerHTML = `<span class="text-sm font-bold text-purple-800">${p.name[0]}</span>`;
                                  }}
                                />
                              ) : (
                                <span className="text-sm font-black text-purple-800">
                                  {p.name?.[0] || "?"}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="m-0 font-bold text-slate-900 text-xs">
                                  {p.name}
                                </p>
                                {p.is_featured && (
                                  <span className="bg-indigo-50 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-indigo-100">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p
                                className="m-0 text-slate-400 mt-0.5"
                                style={{ fontSize: 10 }}
                              >
                                <span className="font-semibold text-slate-500">
                                  {p.brand}
                                </span>
                                {p.volume_ml && ` • ${p.volume_ml}ml`}
                                {p.fragrance_type && ` • ${p.fragrance_type}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-purple-800 bg-purple-50 border border-purple-100/50">
                            {displayCategory}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-slate-500 font-medium text-[11px]">
                            {p.concentration || "Not Specified"}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          {p.discount_price > 0 ? (
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-slate-900">
                                ₹{p.discount_price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through">
                                ₹{p.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-900">
                              ₹{p.price?.toLocaleString() || "0"}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <StockBadge stock={p.stock_quantity} />
                        </td>

                        {/* Interactive operations */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openStock(p)}
                              title="Update Stock"
                              className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer border-0 transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => openEdit(p)}
                              title="Edit All Details"
                              className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer border-0 transition-all bg-sky-50 text-sky-700 hover:bg-sky-100"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => openDelete(p)}
                              title="Delete Scent"
                              className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer border-0 transition-all bg-red-50 text-red-600 hover:bg-red-100"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quick status report footer */}
          <div
            className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50"
            style={{ borderTop: "1px solid #f0edf5" }}
          >
            <p className="text-xs text-slate-400 m-0">
              Showing {filteredProducts.length} of {products.length} registered
              fragrances
            </p>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="text-amber-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {lowStockCount} items low stock
              </span>
              <span className="text-red-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {outOfStockCount} critical restocks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STREAMING_CHUNK: ADD & EDIT FORM DIALOG ── */}
      {(modal === "add" || modal === "edit") && (
        <Modal
          title={
            modal === "add" ? "Create Scent Profile" : "Edit Scent Profile"
          }
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Perfume Name *</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Oud Royale"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Brand Name *</label>
                <input
                  name="brand"
                  type="text"
                  placeholder="e.g. Royal Scents"
                  value={formData.brand}
                  onChange={handleFormChange}
                  className={inputCls}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Olfactory Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe top notes, heart notes, and base notes..."
                value={formData.description}
                onChange={handleFormChange}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Category Group *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Volume (ml)</label>
                <input
                  name="volume_ml"
                  type="number"
                  placeholder="e.g. 100"
                  value={formData.volume_ml}
                  onChange={handleFormChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Base Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  placeholder="3800"
                  value={formData.price}
                  onChange={handleFormChange}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Discount Price (₹)</label>
                <input
                  name="discount_price"
                  type="number"
                  placeholder="Optional discount price"
                  value={formData.discount_price}
                  onChange={handleFormChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Initial Stock Qty *</label>
                <input
                  name="stock_quantity"
                  type="number"
                  placeholder="e.g. 15"
                  value={formData.stock_quantity}
                  onChange={handleFormChange}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Fragrance Accord / Type</label>
                <input
                  name="fragrance_type"
                  type="text"
                  placeholder="e.g. Woody Musk, Fresh Floral"
                  value={formData.fragrance_type}
                  onChange={handleFormChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Oil Concentration</label>
                <input
                  name="concentration"
                  type="text"
                  placeholder="e.g. EDP, Parfum, Cologne"
                  value={formData.concentration}
                  onChange={handleFormChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Product Image URL</label>
                <input
                  name="image_url"
                  type="text"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={handleFormChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-b border-slate-100 my-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800 uppercase">
                  Feature on Landing Page
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Promotes this fragrance to the featured highlights.
                </span>
              </div>
              <input
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleFormChange}
                className="w-4.5 h-4.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              />
            </div>

            {formErr && (
              <p className="text-red-500 text-[11px] font-semibold m-0">
                {formErr}
              </p>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 rounded-xl text-white text-xs font-bold cursor-pointer border-0 hover:opacity-90 transition-opacity bg-purple-900 shadow-md flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <span className="w-4.5 h-4.5 rounded-full border-2 border-slate-200 border-t-white animate-spin"></span>
              ) : modal === "add" ? (
                "Save to Database"
              ) : (
                "Update Scent Record"
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* ── STREAMING_CHUNK: STOCK ADJUSTER MODAL ── */}
      {modal === "stock" && (
        <Modal title="Quick Stock Adjustment" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Perfume Unit
              </span>
              <p className="text-xs font-bold text-purple-950 mt-0.5 m-0">
                {activeProduct?.name}{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  ({activeProduct?.brand})
                </span>
              </p>
            </div>

            <div>
              <label className={labelCls}>New Stock Quantity (Units)</label>
              <input
                type="number"
                placeholder="25"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className={inputCls}
                min="0"
              />
            </div>

            <button
              onClick={handleUpdateStockOnly}
              disabled={actionLoading}
              className="w-full py-3 rounded-xl text-white text-xs font-bold cursor-pointer border-0 hover:opacity-90 transition-opacity bg-purple-900 shadow-md flex items-center justify-center"
            >
              {actionLoading ? (
                <span className="w-4.5 h-4.5 rounded-full border-2 border-slate-200 border-t-white animate-spin"></span>
              ) : (
                "Commit Stock Quantity"
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* ── STREAMING_CHUNK: VERIFY DELETION DIALOG ── */}
      {modal === "delete" && (
        <Modal title="Verify Permanent Deletion" onClose={() => setModal(null)}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-red-100">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <p className="text-sm font-black text-slate-900 mb-1">
              Are you sure?
            </p>
            <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto leading-relaxed">
              You are about to delete{" "}
              <strong className="text-slate-800">
                "{activeProduct?.name}"
              </strong>
              . This action is irreversible and will remove the record
              permanently.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel Action
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer border-0 bg-red-600 hover:bg-red-700 transition-colors shadow-md flex items-center justify-center"
              >
                {actionLoading ? (
                  <span className="w-4.5 h-4.5 rounded-full border-2 border-slate-200 border-t-white animate-spin"></span>
                ) : (
                  "Delete Scent"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
