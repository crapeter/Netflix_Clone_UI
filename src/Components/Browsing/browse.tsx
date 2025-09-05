import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Logout from "../Login/logout";

interface Profile {
  id: number;
  name: string;
  age: number;
  password?: string;
}

interface Movie {
  id: number;
  description: string;
  genre: string;
  moviePoster: string;
  rating: string;
  release_date: string;
  title: string;
  videoUrl: string;
}

function Browse() {
  const movieCategories: string[] = [
    "Children & Family",
    "Action & Adventure",
    "Comedies",
    "Sci-Fi",
    "Fantasy",
    "Romance",
    "Dramas",
    "Western",
    "Horror",
    "Thrillers",
    "Classic",
    "Documentaries",
    "Anime",
    "Foreign",
    "Independent",
    "LGBTQ+",
    "Music",
    "Sports",
    "TV Shows",
    "Teen TV Shows",
    "Christmas",
    "Others",
  ];

  const nav = useNavigate();
  const loc = useLocation();
  const profile: Profile = loc.state?.profile;
  const email: string = loc.state?.email;

  const [showSettingsTab, setShowSettingsTab] = useState(false);
  const [firstAppearance, setFirstAppearance] = useState(true);
  const [movieData, setMovieData] = useState<Movie[]>([]);

  useEffect(() => {
    function filterRestrictedContent(): Movie[] {
      let updatedMovieData: Movie[] = [];

      if (profile.age < 12) {
        updatedMovieData = movieData.filter(
          (movie) => movie.rating === "G" || movie.rating === "PG"
        );
      }
      return updatedMovieData;
    }

    if (firstAppearance) {
      setFirstAppearance(false);
      setMovieData(filterRestrictedContent());
    }
  }, [firstAppearance, profile, movieData]);

  return (
    <div
      className={`pt-10 w-screen min-h-screen bg-cover bg-center bg-fixed transition-opacity duration-100 ${
        firstAppearance ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: "url('/star_destroyer.png')" }}
    >
      <Logout />
      {/** Settings Icon */}
      <div className="fixed top-0 right-0 m-4 w-10 h-10 cursor-pointer z-50">
        <img
          src="/settings.svg"
          alt="Profile"
          onClick={() => setShowSettingsTab(!showSettingsTab)}
        />
      </div>

      <div className="flex">
        {/** Left Sidebar */}
        <div className="fixed left-0 top-1/2 -translate-y-1/2 w-56 bg-black/90 text-white border border-netflix-red flex flex-col items-center space-y-6 py-6">
          {/** Left Sidebar content goes here */}
          <div>
            <img
              src="/search.svg"
              className="w-12 h-12 m-2 hover:cursor-pointer"
              alt="Search"
              onClick={() => alert("Search clicked")}
            />
            <img
              src="/home.svg"
              className="w-12 h-12 m-2 hover:cursor-pointer"
              alt="Home"
              onClick={() => alert("Home clicked")}
            />
            <img
              src="/store.png"
              className="w-12 h-12 m-2 hover:cursor-pointer"
              alt="store"
              onClick={() => alert("Store clicked")}
            />
            <img
              src="/download.png"
              className="invert w-12 h-12 m-2 hover:cursor-pointer"
              alt="download"
              onClick={() => alert("Download clicked")}
            />
          </div>
        </div>

        {/** Main Content Area */}
        <div className="flex-1 ml-64 max-w-8/10">
          <h1 className="text-white text-3xl mb-6">Browse Movies and Shows</h1>
          <div>
            {movieCategories.map((category) => (
              <div key={category} className="mb-8 max-w-full">
                <h2 className="text-white text-2xl font-bold mb-4 text-left">
                  {category}
                </h2>

                {/* Independent horizontal scroll for this category */}
                <div className="overflow-x-auto max-w-full">
                  <div className="flex space-x-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-40 h-60 bg-netflix-red flex-shrink-0 rounded hover:cursor-pointer`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSettingsTab && (
        <div className="fixed top-0 right-0 w-64 h-full bg-netflix-lighter/50 text-white p-4 shadow-lg border-l border-l-netflix-red">
          <div className="flex flex-col">
            <button
              className="max-w-7/10 bg-netflix-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => nav("/profiles", { state: { email } })}
            >
              Switch Profile
            </button>
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <p>Settings content goes here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Browse;
