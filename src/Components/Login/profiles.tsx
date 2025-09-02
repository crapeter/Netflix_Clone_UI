import "../../CSS/home.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface Profile {
  id: number;
  name: string;
  age: number;
  password?: string;
}

function Home() {
  const nav = useNavigate();
  const loc = useLocation();
  const { email } = loc.state || {};

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [passwordDisplay, setPasswordDisplay] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [clickedProfile, setClickedProfile] = useState<Profile | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  const [newProfileDisplay, setNewProfileDisplay] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileAge, setNewProfileAge] = useState(0);
  const [newProfilePassword, setNewProfilePassword] = useState("");

  useEffect(() => {
    if (email) {
      axios
        .get(`/api/profiles/${email}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setProfiles(response.data.map(mapToProfile));
        });
    }
  }, [email]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mapToProfile(dto: any): Profile {
    return {
      id: dto.id,
      name: dto.name,
      age: dto.age,
    };
  }

  function addProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email) {
      axios
        .post(
          `/api/profiles/add/${email}`,
          {
            name: passwordProtected
              ? newProfileName + ":Locked"
              : newProfileName,
            age: newProfileAge,
            password: newProfilePassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setProfiles((prevProfiles) => [
            ...prevProfiles,
            mapToProfile(response.data),
          ]);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error adding profile:", error);
        });
    }
    // reset after adding
    setNewProfileDisplay(false);
    setNewProfileName("");
    setNewProfileAge(0);
  }

  function handleNewProfileClick() {
    setNewProfileDisplay(true);
  }

  function handleProfileClick(profile: Profile) {
    // Navigate to the page with all the movies and such, age restricted if necessary
    setClickedProfile(profile);

    if (profile.name.split(":")[1] === "Locked") {
      setPasswordDisplay(true);
      setFadeOut(false);
    } else {
      setFadeOut(true);
      setTimeout(() => {
        nav("/browse", { state: { profile, email } });
      }, 200);
    }
  }

  function handlePasswordEntry(password: string) {
    // Password verification will eventually go here
    if (clickedProfile && clickedProfile.name.split(":")[1] === "Locked") {
      axios
        .post(
          `/api/profiles/verifyPassword/${clickedProfile.id}?password=${password}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.data) {
            setFadeOut(true);

            setTimeout(() => {
              setPasswordDisplay(false);
              setEnteredPassword("");
              nav("/browse", {
                state: { profile: clickedProfile, email: email },
              });
            }, 200);
          } else {
            alert("Incorrect password. Please try again.");
          }
        })
        .catch((err) => {
          console.error("Error verifying password:", err);
        });
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-opacity duration-200 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="text-5xl mb-6 font-thin">Who's watching?</h1>
      <div className="flex space-x-4">
        {profiles.map((profile, index) => {
          const colors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-green-500",
            "bg-blue-500",
            "bg-purple-500",
          ];
          const hoverColors = [
            "hover:bg-red-800",
            "hover:bg-orange-700",
            "hover:bg-yellow-600",
            "hover:bg-green-700",
            "hover:bg-blue-800",
            "hover:bg-purple-800",
          ];
          const colorClass = colors[index % colors.length];
          const hoverColorClass = hoverColors[index % hoverColors.length];

          return (
            <div
              key={profile.id}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center text-xl font-semibold ${colorClass} ${hoverColorClass} transition-colors duration-200`}
                onClick={() => handleProfileClick(profile)}
              >
                {profile.name.split(":")[0].charAt(0)}
              </div>
              <span className="mt-2 text-lg">{profile.name.split(":")[0]}</span>
            </div>
          );
        })}
      </div>

      {/* Add a new profile */}
      <div>
        <button
          onClick={() => {
            handleNewProfileClick();
          }}
          className="mt-4 px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition"
        >
          Add Profile
        </button>
      </div>

      {/* Add a new profile */}
      {newProfileDisplay && (
        <div
          className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50`}
          onClick={() => setNewProfileDisplay(false)}
        >
          <div
            className="relative bg-gray-900 rounded-2xl shadow-2xl w-80 max-w-full p-6 flex flex-col items-center space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">New Profile</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => addProfile(e)}
            >
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">
                  Profile Name:
                </label>
                <input
                  className="p-3 rounded bg-gray-400 text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter profile name"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">Age:</label>
                <input
                  className="p-3 rounded bg-gray-400 text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  type="number"
                  onChange={(e) => setNewProfileAge(Number(e.target.value))}
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label>Password Protect:</label>
                <input
                  type="checkbox"
                  checked={passwordProtected}
                  onChange={() => setPasswordProtected(!passwordProtected)}
                  className="ml-2"
                />
              </div>

              {passwordProtected && (
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="p-3 rounded bg-gray-400 text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                    onChange={(e) => setNewProfilePassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition"
              >
                Add Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Password Entry Overlay */}
      {passwordDisplay && (
        <div
          className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50`}
          onClick={() => setPasswordDisplay(false)}
        >
          <div
            className="relative bg-gray-900 rounded-2xl shadow-2xl w-80 max-w-full p-6 flex flex-col items-center space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold">Enter Password</h2>
            <p className="text-gray-300 text-center text-sm">
              This profile is protected. Please enter your password to continue.
            </p>

            <div className="w-full flex flex-col items-center space-y-4">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              />
              <button
                onClick={() => handlePasswordEntry(enteredPassword)}
                className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-2 rounded-lg transition"
              >
                Enter
              </button>
            </div>

            <button
              onClick={() => setPasswordDisplay(false)}
              className="text-gray-400 text-sm hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
