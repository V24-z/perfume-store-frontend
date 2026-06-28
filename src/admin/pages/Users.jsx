import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ── Avatar Colors ──
const avatarColors = [
  { bg: "#eeedfe", text: "#534AB7" },
  { bg: "#e1f5ee", text: "#0F6E56" },
  { bg: "#fbeaf0", text: "#993556" },
  { bg: "#faeeda", text: "#854F0B" },
  { bg: "#e6f1fb", text: "#185FA5" },
  { bg: "#fcebeb", text: "#A32D2D" },
];

function getColor(id) {
  return avatarColors[(parseInt(id || 0) || 0) % avatarColors.length];
}

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Badge ──
function Badge({ label, type }) {
  const styles = {
    active: { background: "#e1f5ee", color: "#0F6E56" },
    blocked: { background: "#fcebeb", color: "#A32D2D" },
    admin: { background: "#eeedfe", color: "#534AB7" },
    user: { background: "#f3f4f6", color: "#6b7280" },
  };

  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={styles[type] || styles.user}
    >
      {label}
    </span>
  );
}

// ── Icon Button ──
function IconBtn({ onClick, title, bg, color, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-70"
      style={{ background: bg, color }}
    >
      {children}
    </button>
  );
}

// ── Icons ──
const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// ── Main Component ──
function User() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewUser, setViewUser] = useState(null);

  // ── Fetch users from FastAPI ──
  useEffect(() => {
    // FIXED: Shifted storage key from "token" to "access_token" to keep header parsing synchronized
    const token = localStorage.getItem("access_token");
    fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data || []);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // ── Normalize backend data ──
  const normalizedUsers = users.map((u, i) => ({
    id: u.id || i,
    name: u.name,
    email: u.email,
    phone: u.phon,
    role: u.role || "User",
    reg: u.registerd,
    status: u.role === "Admin" ? "Active" : "Active", 
  }));

  // ── Filter logic ──
  const filtered = normalizedUsers.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter ? u.status === statusFilter : true;

    return matchSearch && matchStatus;
  });

  // ── Toggle role (frontend only demo) ──
  const toggleRole = (id) => {
    setUsers((prev) =>
      prev.map((u, i) =>
        (u.id || i) === id
          ? { ...u, role: u.role === "User" ? "Admin" : "User" }
          : u
      )
    );
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Users</h1>
        <p className="text-xs text-gray-400">Manage users from backend</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border">

        {/* Search */}
        <div className="p-4 flex gap-3 border-b">
          <input
            className="border px-3 py-2 rounded text-xs flex-1"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => {
              const c = getColor(u.id);

              return (
                <tr key={u.id} className="border-t hover:bg-gray-50">

                  {/* User */}
                  <td className="p-3 flex items-center gap-2">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full font-bold"
                      style={{ background: c.bg, color: c.text }}
                    >
                      {initials(u.name)}
                    </div>

                    <div>
                      <p className="font-medium">{u.name}</p>
                    </div>
                  </td>

                  {/* Email */}
                  <td>{u.email}</td>

                  {/* Phone */}
                  <td>{u.phone}</td>

                  {/* Role */}
                  <td>
                    <Badge label={u.role} type={u.role.toLowerCase()} />
                  </td>

                  {/* Registered */}
                  <td>
                    {u.reg
                      ? new Date(u.reg).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  {/* Actions */}
                  <td className="flex gap-2 p-2">
                    <IconBtn
                      title="View"
                      bg="#e6f1fb"
                      color="#185FA5"
                      onClick={() => setViewUser(u)}
                    >
                      <EyeIcon />
                    </IconBtn>

                    <IconBtn
                      title="Toggle Role"
                      bg="#eeedfe"
                      color="#534AB7"
                      onClick={() => toggleRole(u.id)}
                    >
                      <ShieldIcon />
                    </IconBtn>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-80">
            <h2 className="font-bold mb-3">User Details</h2>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Phone:</b> {viewUser.phone}</p>
            <p><b>Role:</b> {viewUser.role}</p>

            <button
              className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => setViewUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default User;