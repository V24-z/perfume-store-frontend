import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const initialForm = {
  title: "",
  subtitle: "",
  button_text: "",
  button_link: "",
  image_url: "",
};

// HELPER: Safely generate headers containing the stored bearer token
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token"); 
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

function Banner() {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_URL}/banners`);
      setBanners(res.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBanners();
    })();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = (banner) => {
    setEditId(banner.id);

    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      button_text: banner.button_text || "",
      button_link: banner.button_link || "",
      image_url: banner.image_url || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editId) {
        // FIXED: Appended security wrapper config to authorize PUT requests
        await axios.put(`${API_URL}/banners/${editId}`, formData, getAuthHeaders());
        toast.success("Banner updated successfully");
      } else {
        // FIXED: Appended security wrapper config to authorize POST requests
        await axios.post(`${API_URL}/banners`, formData, getAuthHeaders());
        toast.success("Banner added successfully");
      }

      setFormData(initialForm);
      setEditId(null);
      await fetchBanners();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // FIXED: Attached getAuthHeaders() wrapper to authorize banner deletions
      await axios.delete(`${API_URL}/banners/${id}`, getAuthHeaders());
      await fetchBanners();
      setDeleteId(null);
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      setDeleteId(null);
      toast.error("Failed to delete banner");
    } finally {
      setLoading(false);
    }
  };

  const filteredBanners = banners.filter((banner) =>
    banner.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Banner Management</h2>

        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
          {banners.length} Banners
        </span>
      </div>

      {/* Add Banner Form */}
      <div className="bg-white p-5 rounded-lg shadow mb-5">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Banner Title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <input
              type="text"
              name="subtitle"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="text"
              name="button_text"
              placeholder="Button Text"
              value={formData.button_text}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="text"
              name="button_link"
              placeholder="Button Link"
              value={formData.button_link}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <input
            type="text"
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-4"
            required
          />
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded"
            >
              {loading && !deleteId ? "Saving..." : editId ? "Update Banner" : "Add Banner"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setFormData(initialForm);
                }}
                className="bg-gray-500 text-white px-5 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search banner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Banner List */}
      <div className="grid gap-4">
        {filteredBanners.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-center text-gray-500">
            No banners found
          </div>
        ) : (
          filteredBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-32 h-20 object-cover rounded"
                />

                <div>
                  <h3 className="font-semibold">{banner.title}</h3>

                  <p className="text-sm text-gray-500">{banner.subtitle}</p>

                  <p className="text-xs text-indigo-600">
                    {banner.button_text}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(banner.id)}
                  disabled={loading} // FIXED: Prevents locking out other buttons unless an active server request is processing
                  className={`px-3 py-1 rounded text-white ${loading
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-2">
              Delete Banner
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this banner?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(deleteId)}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;