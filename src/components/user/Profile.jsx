import { useAuth } from "../../context/useAuth.jsx"; // your hook
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, ArrowLeft, LogOut } from "lucide-react";
import { useEffect } from "react";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verifying Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-900 antialiased font-sans p-4 relative overflow-hidden bg-slate-50/50">
      {/* Premium background ambient aura blur objects */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-gradient-to-tr from-fuchsia-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Luxury Profile Content Container Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 text-center shadow-sm">
        
        {/* Back navigation button trigger */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 flex items-center gap-1 text-slate-400 hover:text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors border-0 bg-transparent cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        {/* Brand context ribbon banner mark */}
        <div className="flex items-center justify-center gap-1.5 mt-4 mb-5">
          <span className="w-1.5 h-3.5 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-violet-600">Lumière Account</p>
        </div>

        {/* Monogram profile avatar initial glyph wrapper */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center text-2xl font-black text-white shadow-md">
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Identity block titles */}
        <h2 className="text-xl font-black text-[#1a0533] tracking-tight">
          My Profile Dashboard
        </h2>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1 mb-6">Secured Registry Details</p>

        {/* Information entry lists block rows grid */}
        <div className="space-y-3.5 mb-6 text-left">
          {/* Full Name */}
          {user.name && (
            <div className="flex items-center gap-3 bg-slate-50/60 border border-slate-200/60 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50">
              <User size={15} className="text-violet-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400">Full Name</span>
                <span className="block text-sm font-bold text-slate-800 truncate mt-0.5">{user.name}</span>
              </div>
            </div>
          )}

          {/* Email Address */}
          {user.email && (
            <div className="flex items-center gap-3 bg-slate-50/60 border border-slate-200/60 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50">
              <Mail size={15} className="text-violet-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400">Email Address</span>
                <span className="block text-sm font-bold text-slate-800 truncate mt-0.5">{user.email}</span>
              </div>
            </div>
          )}

          {/* Phone Number Contact */}
          {user.phon && (
            <div className="flex items-center gap-3 bg-slate-50/60 border border-slate-200/60 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50">
              <Phone size={15} className="text-violet-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400">Phone Contact</span>
                <span className="block text-sm font-bold text-slate-800 font-mono mt-0.5">{user.phon}</span>
              </div>
            </div>
          )}
        </div>

        {/* Safe account destruction token session termination trigger */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-950 text-white rounded-xl py-3.5 hover:bg-slate-850 shadow-sm active:scale-95 transition-all border-0 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
}

export default Profile;