import { useNavigate } from "react-router-dom";

function Logout() {
  const nav = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <div>
      <button
        onClick={handleLogout}
        className="fixed top-15 left-15 mt-4 px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
