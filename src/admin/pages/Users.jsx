import { useState } from "react";

const initialUsers = [
  { id: "U001", name: "Priya Shah",    email: "priya@gmail.com",  phone: "9876543210", reg: "2024-01-15", orders: 8,  status: "Active",  role: "User"  },
  { id: "U002", name: "Arjun Mehta",   email: "arjun@gmail.com",  phone: "9812345678", reg: "2024-02-20", orders: 3,  status: "Active",  role: "User"  },
  { id: "U003", name: "Sneha Rao",     email: "sneha@gmail.com",  phone: "9823456789", reg: "2024-03-05", orders: 12, status: "Active",  role: "Admin" },
  { id: "U004", name: "Rahul Kumar",   email: "rahul@gmail.com",  phone: "9834567890", reg: "2024-03-18", orders: 1,  status: "Blocked", role: "User"  },
  { id: "U005", name: "Meena Tiwari",  email: "meena@gmail.com",  phone: "9845678901", reg: "2024-04-02", orders: 5,  status: "Active",  role: "User"  },
  { id: "U006", name: "Vikram Nair",   email: "vikram@gmail.com", phone: "9856789012", reg: "2024-04-15", orders: 0,  status: "Blocked", role: "User"  },
  { id: "U007", name: "Divya Pillai",  email: "divya@gmail.com",  phone: "9867890123", reg: "2024-05-10", orders: 7,  status: "Active",  role: "User"  },
];

const avatarColors = [
  { bg: "#eeedfe", text: "#534AB7" },
  { bg: "#e1f5ee", text: "#0F6E56" },
  { bg: "#fbeaf0", text: "#993556" },
  { bg: "#faeeda", text: "#854F0B" },
  { bg: "#e6f1fb", text: "#185FA5" },
  { bg: "#fcebeb", text: "#A32D2D" },
];

function getColor(id) {
  return avatarColors[parseInt(id.replace("U", "")) % avatarColors.length];
}

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ── Reusable Badge ──
function Badge({ label, type }) {
  const styles = {
    active:   { background: "#e1f5ee", color: "#0F6E56" },
    blocked:  { background: "#fcebeb", color: "#A32D2D" },
    admin:    { background: "#eeedfe", color: "#534AB7" },
    user:     { background: "#f3f4f6", color: "#6b7280" },
  };
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={styles[type]}
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
      className="w-7 h-7 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-opacity hover:opacity-70"
      style={{ background: bg, color }}
    >
      {children}
    </button>
  );
}

// ── SVG Icons ──
const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const UnlockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 018 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── View Modal ──
function ViewModal({ user, onClose }) {
  const c = getColor(user.id);
  const rows = [
    ["User ID",           user.id],
    ["Email",             user.email],
    ["Phone",             user.phone],
    ["Registered",        user.reg],
    ["Total Orders",      user.orders],
    ["Role",              user.role],
    ["Account Status",    user.status],
  ];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold m-0" style={{ color: "#1a0533" }}>User Details</p>
          <button
            onClick={onClose}
            className="border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 p-0"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-2"
            style={{ background: c.bg, color: c.text }}
          >
            {initials(user.name)}
          </div>
          <p className="text-sm font-bold m-0" style={{ color: "#1a0533" }}>{user.name}</p>
          <div className="flex gap-1.5 mt-1.5">
            <Badge label={user.role}   type={user.role.toLowerCase()} />
            <Badge label={user.status} type={user.status.toLowerCase()} />
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-0">
          {rows.map(([key, val]) => (
            <div
              key={key}
              className="flex justify-between py-2"
              style={{ borderBottom: "1px solid #f9f7fc" }}
            >
              <span className="text-[11px] text-gray-400">{key}</span>
              <span className="text-[11px] font-medium" style={{ color: "#1a0533" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──
function User() {
  const [users, setUsers]       = useState(initialUsers);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewUser, setViewUser] = useState(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? u.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id) =>
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u)
    );

  const toggleRole = (id) =>
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, role: u.role === "User" ? "Admin" : "User" } : u)
    );

  const stats = [
    { label: "Total Users",    value: users.length,                                    bg: "#eeedfe", color: "#534AB7" },
    { label: "Active",         value: users.filter((u) => u.status === "Active").length,  bg: "#e1f5ee", color: "#0F6E56" },
    { label: "Blocked",        value: users.filter((u) => u.status === "Blocked").length, bg: "#fcebeb", color: "#A32D2D" },
    { label: "Admins",         value: users.filter((u) => u.role === "Admin").length,     bg: "#faeeda", color: "#854F0B" },
  ];

  return (
    <div className="space-y-4">

      {/* ── Page title ── */}
      <div>
        <h1 className="text-xl font-bold m-0" style={{ color: "#1a0533" }}>Users</h1>
        <p className="text-xs text-gray-400 mt-0.5 mb-0">Manage customer accounts and roles</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4"
            style={{ border: "1px solid #f0edf5" }}
          >
            <p className="text-[10px] text-gray-400 uppercase tracking-wider m-0 mb-1">{label}</p>
            <p className="text-2xl font-bold m-0" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #f0edf5" }}>

        {/* Filters */}
        <div
          className="flex flex-col sm:flex-row gap-3 p-4"
          style={{ borderBottom: "1px solid #f0edf5" }}
        >
          <div
            className="flex items-center gap-2 flex-1 rounded-full px-4 py-2"
            style={{ background: "#f9f7fc", border: "1px solid #e5e0f0" }}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs flex-1 text-gray-700"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-full px-4 py-2 cursor-pointer outline-none"
            style={{ background: "#f9f7fc", border: "1px solid #e5e0f0", color: "#374151" }}
          >
            <option value="">All Status</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#faf8fd", borderBottom: "1px solid #f0edf5" }}>
                {["#", "User", "Contact", "Registered", "Orders", "Role", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-3 font-medium text-gray-400 text-left"
                    style={{ textAlign: ["Orders", "Role", "Status", "Actions"].includes(h) ? "center" : "left" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => {
                  const c = getColor(u.id);
                  return (
                    <tr
                      key={u.id}
                      className="transition-colors"
                      style={{ borderBottom: "1px solid #faf7fd" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8fd")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* # */}
                      <td className="py-3 px-3 text-gray-400 text-xs">{i + 1}</td>

                      {/* User */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: c.bg, color: c.text }}
                          >
                            {initials(u.name)}
                          </div>
                          <div>
                            <p className="m-0 font-medium text-xs" style={{ color: "#1a0533" }}>{u.name}</p>
                            <p className="m-0 text-gray-400" style={{ fontSize: 10 }}>{u.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3">
                        <p className="m-0 text-gray-600 text-xs">{u.email}</p>
                        <p className="m-0 text-gray-400" style={{ fontSize: 10 }}>{u.phone}</p>
                      </td>

                      {/* Registered */}
                      <td className="py-3 px-3 text-center text-gray-500 text-xs">{u.reg}</td>

                      {/* Orders */}
                      <td className="py-3 px-3 text-center font-semibold text-xs" style={{ color: "#1a0533" }}>
                        {u.orders}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3 text-center">
                        <Badge label={u.role} type={u.role.toLowerCase()} />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <Badge label={u.status} type={u.status.toLowerCase()} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View */}
                          <IconBtn
                            onClick={() => setViewUser(u)}
                            title="View Details"
                            bg="#e6f1fb"
                            color="#185FA5"
                          >
                            <EyeIcon />
                          </IconBtn>

                          {/* Block / Unblock */}
                          <IconBtn
                            onClick={() => toggleStatus(u.id)}
                            title={u.status === "Active" ? "Block User" : "Unblock User"}
                            bg={u.status === "Active" ? "#fcebeb" : "#e1f5ee"}
                            color={u.status === "Active" ? "#dc2626" : "#0F6E56"}
                          >
                            {u.status === "Active" ? <LockIcon /> : <UnlockIcon />}
                          </IconBtn>

                          {/* Toggle Role */}
                          <IconBtn
                            onClick={() => toggleRole(u.id)}
                            title={u.role === "User" ? "Make Admin" : "Make User"}
                            bg={u.role === "User" ? "#eeedfe" : "#f3f4f6"}
                            color={u.role === "User" ? "#534AB7" : "#6b7280"}
                          >
                            <ShieldIcon />
                          </IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid #f0edf5" }}
        >
          <p className="text-xs text-gray-400 m-0">
            Showing {filtered.length} of {users.length} users
          </p>
          <p className="text-xs m-0" style={{ color: "#A32D2D" }}>
            {users.filter((u) => u.status === "Blocked").length} blocked accounts
          </p>
        </div>
      </div>

      {/* ── View Modal ── */}
      {viewUser && (
        <ViewModal user={viewUser} onClose={() => setViewUser(null)} />
      )}

    </div>
  );
}

export default User;