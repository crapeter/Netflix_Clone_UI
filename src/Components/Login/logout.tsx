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
        className="fixed top-0 right-5 mt-4 px-4 py-2 bg-neutral-500 text-white rounded-lg hover:cursor-pointer hover:bg-neutral-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
