import { useAuth } from "../../context/useAuth";
import { useLocation } from "react-router-dom";

const Header = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const page = location.pathname.split("/").filter(Boolean).pop();
  const pageLabel = page ? page.charAt(0).toUpperCase() + page.slice(1) : "Dashboard";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const iconBtn = {
    width: 36, height: 36,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  };

  return (
    <header
      className="w-full flex-shrink-0"
      style={{ background: "#1a0533", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* ── Top row ── */}
      <div
        className="flex items-center justify-between px-3 md:px-5 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Left */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Hamburger — always visible */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            style={{ ...iconBtn, borderRadius: 8 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.13)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search — hidden on smallest screens */}
          <div
            className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2 cursor-pointer transition-all"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              minWidth: 180,
            }}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(255,255,255,0.35)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Search anything...</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 md:gap-2">

          {/* Search icon on mobile only */}
          <button
            aria-label="Search"
            className="sm:hidden"
            style={iconBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.13)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              aria-label="Notifications"
              style={iconBtn}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.13)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <span
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-white font-bold"
              style={{ background: "#ef4444", fontSize: 9, width: 15, height: 15, borderRadius: "50%", pointerEvents: "none" }}
            >
              3
            </span>
          </div>

          {/* Settings — hidden on mobile */}
          <button
            aria-label="Settings"
            className="hidden md:flex"
            style={iconBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.13)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Divider — hidden on mobile */}
          <div className="hidden md:block w-px h-6 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

          {/* User pill */}
          <div
            className="flex items-center gap-2 rounded-full cursor-pointer transition-all"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "5px 10px 5px 5px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0" style={{ fontSize: 11 }}>
              {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
            </div>
            {/* Name — hidden on mobile */}
            <div className="hidden sm:block">
              <p className="text-white font-medium m-0" style={{ fontSize: 12, lineHeight: 1.2 }}>
                {user?.name || "Admin"}
              </p>
              <p className="m-0" style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                Super Admin
              </p>
            </div>
            <svg className="hidden sm:block w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb row ── */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5">
        <div>
          <p className="text-white font-semibold m-0" style={{ fontSize: 15 }}>{pageLabel}</p>
          <div className="flex items-center gap-1 mt-0.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            <span>Admin</span>
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-yellow-300">{pageLabel}</span>
          </div>
        </div>
        {/* Date — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{today}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;