import { useNavigate } from "react-router-dom";
import type { Profile } from "../../Types/Index";

interface information {
  profile: Profile;
  email: string;
}

function Sidebar({ profile, email }: information) {
  const nav = useNavigate();

  return (
    <div>
      {/** Left Sidebar */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 max-w-56 bg-black/90 text-white border border-netflix-red flex flex-col items-center space-y-6 py-6">
        {/** Left Sidebar content goes here */}
        <div>
          <div className="pb-1">
            <img
              src="/search.svg"
              className="w-12 h-12 m-2 hover:cursor-pointer"
              alt="Search"
              onClick={() => nav("/search", { state: { email, profile } })}
            />
          </div>
          <div className="pb-1">
            <img
              src="/home.svg"
              className="w-12 h-12 m-2 hover:cursor-pointer"
              alt="Home"
              onClick={() => nav("/browse", { state: { email, profile } })}
            />
          </div>
          <div className="pb-1">
            <img
              src="/store.png"
              className="w-12 h-12 m-2 hover:cursor-pointer"
              alt="store"
              onClick={() => alert("Store clicked")}
            />
          </div>
          <div className="pb-1">
            <img
              src="/download.png"
              className="invert w-12 h-12 m-2 hover:cursor-pointer"
              alt="download"
              onClick={() => alert("Download clicked")}
            />
          </div>
          <div className="pb-1">
            <img
              src="/watch_history.svg"
              className="invert w-12 h-12 m-2 hover:cursor-pointer"
              alt="watch history"
              onClick={() => alert("Watch History clicked")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
