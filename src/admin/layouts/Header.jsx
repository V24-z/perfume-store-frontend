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

         
          
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 md:gap-2">

         
           
          

         

          

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