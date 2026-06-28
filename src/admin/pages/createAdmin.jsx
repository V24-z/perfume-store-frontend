import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateAdmin() {
  const token = localStorage.getItem("token");

  const initialState = {
    name: "",
    email: "",
    phon: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
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

  const validate = () => {
    let newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
      newErrors.name = "Only letters and spaces allowed";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Minimum 3 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email";
    }

    // Phone
    if (!formData.phon.trim()) {
      newErrors.phon = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phon)) {
      newErrors.phon = "Enter valid 10-digit mobile number";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Minimum 8 chars with Uppercase, Lowercase, Number & Special Character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setMessage("");
    setError("");

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
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
      setFormData(initialState);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans p-6 sm:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* ══ HEADER ══ */}
        <div className="border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Lumière Suite</p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Controls</h1>
        </div>

        {/* ══ MAIN SPLIT GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Create Form Container */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">Create New Administrator</h2>
              <p className="text-xs text-slate-400 mt-0.5">Provision secure database management access keys.</p>
            </div>

            {message && (
              <div className="mb-4 bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Alexander Pierce"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full text-sm bg-white border rounded-xl p-3 shadow-sm focus:outline-none focus:ring-4 transition-all ${
                    errors.name
                      ? "border-red-400 focus:ring-red-500/10 focus:border-red-500"
                      : "border-slate-200 focus:ring-violet-500/10 focus:border-violet-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@lumierescent.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full text-sm bg-white border rounded-xl p-3 shadow-sm focus:outline-none focus:ring-4 transition-all ${
                    errors.email
                      ? "border-red-400 focus:ring-red-500/10 focus:border-red-500"
                      : "border-slate-200 focus:ring-violet-500/10 focus:border-violet-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Phone Contact</label>
                <input
                  type="text"
                  name="phon"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={formData.phon}
                  onChange={handleChange}
                  className={`w-full text-sm bg-white border rounded-xl p-3 shadow-sm focus:outline-none focus:ring-4 transition-all ${
                    errors.phon
                      ? "border-red-400 focus:ring-red-500/10 focus:border-red-500"
                      : "border-slate-200 focus:ring-violet-500/10 focus:border-violet-500"
                  }`}
                />
                {errors.phon && (
                  <p className="text-red-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.phon}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Access Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full text-sm bg-white border rounded-xl p-3 shadow-sm focus:outline-none focus:ring-4 transition-all ${
                    errors.password
                      ? "border-red-400 focus:ring-red-500/10 focus:border-red-500"
                      : "border-slate-200 focus:ring-violet-500/10 focus:border-violet-500"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-xs font-medium mt-1.5 leading-relaxed flex items-start gap-1">
                    <span className="mt-0.5">⚠️</span> <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                disabled={loading}
                className="w-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white rounded-xl py-3.5 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-sm mt-2 border-0"
              >
                {loading ? "Registering Keys..." : "Create Admin Account"}
              </button>
            </form>
          </div>

          {/* Admin Records List Table */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Active Registry Roles</h2>
                <p className="text-xs text-slate-400 mt-0.5">Verified profile indexes within current workspace.</p>
              </div>
              <span className="bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/10 px-3 py-1 rounded-full text-xs font-bold">
                Active Profiles: {admins.length}
              </span>
            </div>

            {tableLoading ? (
              <div className="flex flex-col justify-center items-center h-72">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
                <p className="text-xs font-medium text-slate-400">Querying platform profiles...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-72 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                <span className="text-2xl mb-2">🛡️</span>
                <p className="text-xs font-medium text-slate-400">No admin records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200/60 text-slate-400 uppercase tracking-wider font-bold text-[10px] text-left">
                      <th className="p-3 font-semibold">Index</th>
                      <th className="p-3 font-semibold">Name Handle</th>
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Phone</th>
                      <th className="p-3 font-semibold text-right">Registered</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {admins.map((admin, index) => (
                      <tr key={admin.id} className="hover:bg-slate-50/30 transition-colors duration-150">
                        {/* Index Count */}
                        <td className="p-3 font-mono font-bold text-slate-400">
                          {String(index + 1).padStart(2, '0')}
                        </td>

                        {/* Name */}
                        <td className="p-3 font-bold text-slate-800">
                          {admin.name}
                        </td>

                        {/* Email */}
                        <td className="p-3 text-slate-600 font-medium">
                          {admin.email}
                        </td>

                        {/* Phone */}
                        <td className="p-3 font-mono text-slate-500">
                          {admin.phon}
                        </td>

                        {/* Local Timestamp */}
                        <td className="p-3 text-slate-400 font-medium text-right">
                          {admin.registerd
                            ? new Date(admin.registerd).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
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