import { useAuth } from "../../context/useAuth.jsx"; // your hook
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-lg font-medium">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-16 -left-16 animate-pulse" />
      <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-24 -right-24 animate-pulse delay-700" />
      <div
        className="absolute w-52 h-52 bg-pink-300/20 rounded-full top-1/2 left-10 animate-bounce"
        style={{ animationDuration: "4s" }}
      />
      {/* blob 1 */}
      <div
        className="absolute w-72 h-72 bg-white/10 rounded-full -top-16 -left-16"
        style={{ animation: "pulse 3s ease-in-out infinite" }}
      />

      {/* blob 2 */}
      <div
        className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-24 -right-24"
        style={{ animation: "pulse 4s ease-in-out infinite reverse" }}
      />

      {/* blob 3 */}
      <div
        className="absolute w-52 h-52 bg-pink-300/20 rounded-full top-1/2 left-10"
        style={{ animation: "bounce 4s ease-in-out infinite" }}
      />
      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl text-center animate-fadeIn">
        {/* Back arrow */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-all hover:gap-2.5"
        >
          <span className="text-lg leading-none">←</span>
          <span>Back</span>
        </button>
        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-full bg-white/30 border-4 border-white/50 flex items-center justify-center text-4xl font-bold text-white shadow-lg backdrop-blur-sm">
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-1 tracking-wide">
          My Profile
        </h2>
        <p className="text-white/60 text-sm mb-6">Account details</p>

        {/* Info rows */}
        <div className="space-y-3 mb-6 text-left">
          {user.name && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm transition hover:bg-white/20">
              <span className="text-white/50 text-xs uppercase tracking-widest w-12 font-medium">
                Name
              </span>
              <span className="text-white font-semibold">{user.name}</span>
            </div>
          )}
          {user.email && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm transition hover:bg-white/20">
              <span className="text-white/50 text-xs uppercase tracking-widest w-12 font-medium">
                Email
              </span>
              <span className="text-white/90 text-sm">{user.email}</span>
            </div>
          )}
           {user.phon && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm transition hover:bg-white/20">
              <span className="text-white/50 text-xs uppercase tracking-widest w-12 font-medium">
                Phone no
              </span>
              <span className="text-white/90 text-sm">{user.phon}</span>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
export default Profile;
