import "../../CSS/home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

/**
 * Yes, Netflix has age restrictions and a comprehensive set of parental controls that allow you to manage the maturity ratings for different profiles,
 * including setting up a "Kids" profile with content limited to ages 12 and under.
 * You can also block specific shows or movies, lock profiles with a PIN,
 * and access viewing history to ensure children only see age-appropriate content on the service
 */

interface Profile {
  id: number;
  name: string;
  age: number;
  isKidsProfile: boolean;
  passwordNeeded: boolean;
}

function Home() {
  const nav = useNavigate();
  const [passwordDisplay, setPasswordDisplay] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [clickedProfile, setClickedProfile] = useState<Profile | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  // temporary data until DB is set up
  const profiles: Profile[] = [
    {
      id: 1,
      name: "Alice",
      age: 30,
      isKidsProfile: false,
      passwordNeeded: true,
    },
    { id: 2, name: "Bob", age: 10, isKidsProfile: true, passwordNeeded: false },
    {
      id: 3,
      name: "Charlie",
      age: 25,
      isKidsProfile: false,
      passwordNeeded: false,
    },
    { id: 4, name: "Daisy", age: 8, isKidsProfile: true, passwordNeeded: false },
    { id: 5, name: "Eve", age: 15, isKidsProfile: false, passwordNeeded: true },
    { id: 6, name: "Frank", age: 40, isKidsProfile: false, passwordNeeded: true },
    { id: 7, name: "Grace", age: 12, isKidsProfile: true, passwordNeeded: false },
  ];

  function handleProfileClick(profile: Profile) {
    // Navigate to the page with all the movies and such, age restricted if necessary
    setClickedProfile(profile);

    if (profile.passwordNeeded) {
      setPasswordDisplay(true);
      setFadeOut(false);
    } else {
      nav("/browse", { state: { profile } });
    }
  }

  function handlePasswordEntry(password: string) {
    // Password verification will eventually go here
    if (clickedProfile && clickedProfile.passwordNeeded) {
      if (password === "incorrect") {
        setFadeOut(true);

        setTimeout(() => {
          setPasswordDisplay(false);
          setEnteredPassword("");
          nav("/browse", { state: { profile: clickedProfile } });
        }, 200);
      } else {
        alert("Incorrect password. Please try again.");
      }
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-opacity duration-200 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="text-5xl mb-4 font-thin">Who's watching?</h1>
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
          const colorClass = colors[index % colors.length];

          return (
            <div
              key={profile.id}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center text-xl font-semibold ${colorClass}`}
                onClick={() => handleProfileClick(profile)}
              >
                {profile.name.charAt(0)}
              </div>
              <span className="mt-2 text-lg">{profile.name}</span>
            </div>
          );
        })}
      </div>

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
