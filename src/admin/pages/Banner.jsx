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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define fetch inside useEffect to satisfy linter and prevent cascading renders
  useEffect(() => {
    const controller = new AbortController();

    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/banners`, { signal: controller.signal });
        setBanners(res.data || []);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching banners:", error);
        }
      }
    };

    fetchBanners();
    return () => controller.abort(); // Cleanup function
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await axios.put(`${API_URL}/banners/${editId}`, formData, getAuthHeaders());
        toast.success("Banner updated successfully");
      } else {
        await axios.post(`${API_URL}/banners`, formData, getAuthHeaders());
        toast.success("Banner added successfully");
      }
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditId(null);
      // Re-fetch after action
      const res = await axios.get(`${API_URL}/banners`);
      setBanners(res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/banners/${id}`, getAuthHeaders());
      const res = await axios.get(`${API_URL}/banners`);
      setBanners(res.data || []);
      setDeleteId(null);
      toast.success("Banner deleted successfully");
    } catch (error) {
      toast.error("Failed to delete banner",error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBanners = banners.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add New Banner
        </button>
      </div>

      <input
        type="text"
        placeholder="Search banner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <div className="grid gap-4">
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={banner.image_url} alt={banner.title} className="w-32 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{banner.title}</h3>
                <p className="text-sm text-gray-500">{banner.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(banner)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => setDeleteId(banner.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit Banner" : "Add New Banner"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="border p-2 rounded w-full" required />
              <input type="text" name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} className="border p-2 rounded w-full" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="button_text" placeholder="Button Text" value={formData.button_text} onChange={handleChange} className="border p-2 rounded w-full" />
                <input type="text" name="button_link" placeholder="Button Link" value={formData.button_link} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>
              <input type="text" name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} className="border p-2 rounded w-full" required />
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white">
                  {loading ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Delete Banner</h2>
            <p className="mb-6">Are you sure you want to delete this banner?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;