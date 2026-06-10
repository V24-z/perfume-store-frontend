import { useState } from "react";

function Event() {
  const [role, setRole] = useState("");
  const [key, setKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      alert("Enter pressed");
    } else {
      setKey(event.key);
    }
    // alert("Pressed:", event.key);
  };

  return (
    <>
      <div className="flex flex-col item-center justify-center gap-2 min-h-40 w-80 border p-4 m-3 rounded-md ">
        <input
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Press any key"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 outline-none focus:border-gray-900 transition-colors"
        />
        <h3>pressed key:{key}</h3>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="px-3 py-2 border border-gray-500 rounded-full hover:bg-green-200 transition-colors"
        >
          Toggle Login
        </button>
        <div className="flex items-center justify-center">
          {isLoggedIn ? (
            <h3>Welcome User</h3>
          ) : (
            <h3 >Please Login</h3>
          )}
        </div>

        <select
          onChange={(e) => setRole(e.target.value)}
          className="px-6 py-4 m-2 rounded-md text-gray-500 border "
        >
          <option value="">select role</option>
          <option value="admin">admin</option>
          <option value="user">user</option>
          <option value="guest">guest</option>
        </select>

        {role === "admin" ? (
          <h2 className="flex items-center justify-center">Admin</h2>
        ) : role === "user" ? (
          <h2 className="flex items-center justify-center">USer</h2>
        ) : role === "guest" ? (
          <h2 className="flex items-center justify-center">guest</h2>
        ) : (
          <h2 className="flex items-center justify-center">invalid role</h2>
        )}
      </div>
    </>
  );
}

export default Event;
