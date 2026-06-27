import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const navSections = [
  {
    label: "Main",
    items: [
      { to: "/admin/", icon: "ti-layout-dashboard", label: "Dashboard" },
      {
        to: "/admin/products",
        icon: "ti-box",
        label: "Products",
      
        
      },
      {
        to: "/admin/orders",
        icon: "ti-shopping-cart",
        label: "Orders",
        
        
      },
      { to: "/admin/users", icon: "ti-users", label: "Users" },
      
     
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/category", icon: "ti-category", label: "Categories" },
      { to: "/admin/banner", icon: "ti-photo", label: "Banner" },
      
    ],
  },
  
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="flex flex-col h-screen w-56 flex-shrink-0"
      style={{ background: "#1a0533" }}
    >
      {/* Logo + mobile close button */}
      <div
        className="flex items-center justify-between px-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(250,204,21,0.15)",
              border: "1px solid rgba(250,204,21,0.3)",
            }}
          >
            <i
              className="ti ti-droplet"
              style={{ fontSize: 17, color: "#fde047" }}
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="m-0 font-bold text-white tracking-widest text-sm">
              LUMIÈRE
            </p>
            <p
              className="m-0 text-[9px] tracking-[0.15em]"
              style={{ color: "rgba(250,204,21,0.5)" }}
            >
              ADMIN
            </p>
          </div>
        </div>

        {/* ✅ Close button — only on mobile */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer border-0"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
          }}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2">
        {navSections.map((section) => (
          <div key={section.label}>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest px-3 mt-4 mb-1.5 m-0"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {section.label}
            </p>
            {section.items.map(({ to, icon, label, badge, badgeType }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose} // ✅ close sidebar on mobile after clicking a link
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 no-underline transition-all"
                style={({ isActive }) => ({
                  background: isActive
                    ? "rgba(250,204,21,0.12)"
                    : "transparent",
                  color: isActive ? "#fde047" : "rgba(255,255,255,0.55)",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.getAttribute("aria-current"))
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.getAttribute("aria-current"))
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <i
                  className={`ti ${icon}`}
                  style={{ fontSize: 18, flexShrink: 0 }}
                  aria-hidden="true"
                />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={
                      badgeType === "red"
                        ? {
                            background: "rgba(239,68,68,0.2)",
                            color: "#f87171",
                          }
                        : {
                            background: "rgba(250,204,21,0.15)",
                            color: "#fde047",
                          }
                    }
                  >
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div
        className="px-2.5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all"
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium m-0 truncate">
              {user?.name || "Admin"}
            </p>
            <p
              className="text-[10px] m-0 truncate"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {user?.email || "admin@lumiere.com"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex-shrink-0 cursor-pointer border-0 bg-transparent p-0 transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
            }
          >
            <i
              className="ti ti-logout"
              style={{ fontSize: 17 }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
