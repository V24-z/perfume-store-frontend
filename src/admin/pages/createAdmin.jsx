import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateAdmin() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phon: "",
    password: "",
  });

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setTableLoading(true);

    try {
      const res = await axios.get(`${API_URL}/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmins(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/create-admin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);

      setFormData({
        name: "",
        email: "",
        phon: "",
        password: "",
      });

      // Refresh admin list
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Create Admin Form */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Create Admin
            </h2>

            {message && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                className="w-full border rounded-lg p-3"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                className="w-full border rounded-lg p-3"
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                className="w-full border rounded-lg p-3"
                placeholder="Phone Number"
                name="phon"
                value={formData.phon}
                onChange={handleChange}
                required
              />

              <input
                className="w-full border rounded-lg p-3"
                placeholder="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                {loading ? "Creating..." : "Create Admin"}
              </button>

            </form>

          </div>

          {/* Admin List starts here */}

                    <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                Admin List
              </h2>

              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                Total: {admins.length}
              </span>
            </div>

            {tableLoading ? (
              <div className="flex justify-center items-center h-56">
                <p className="text-gray-500">Loading admins...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="flex justify-center items-center h-56 border rounded-lg bg-gray-50">
                <p className="text-gray-500 text-lg">
                  No admin records found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="min-w-full border border-gray-200 rounded-lg">

                  <thead className="bg-gray-100">

                    <tr>
                      <th className="px-4 py-3 text-left border-b">
                        Name
                      </th>

                      <th className="px-4 py-3 text-left border-b">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left border-b">
                        Phone
                      </th>

                      <th className="px-4 py-3 text-left border-b">
                        Registered
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {admins.map((admin) => (

                      <tr
                        key={admin.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 border-b">
                          {admin.name}
                        </td>

                        <td className="px-4 py-3 border-b">
                          {admin.email}
                        </td>

                        <td className="px-4 py-3 border-b">
                          {admin.phon}
                        </td>

                        <td className="px-4 py-3 border-b">
                          {admin.registerd
                            ? new Date(admin.registerd).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}