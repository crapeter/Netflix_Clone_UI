import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Logout from "../Login/logout";
import MoviePoster from "../Movie/moviePoster";

interface Profile {
  id: number;
  name: string;
  age: number;
  password?: string;
}

interface Movie {
  id: number;
  director: string;
  description: string;
  genre: string;
  moviePoster: string;
  rating: string;
  release_date: string;
  title: string;
  videoURL?: string;
}

interface SignedUrlResponse {
  signedUrl: string;
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

  const [movieClicked, setMovieClicked] = useState<Movie | null>(null);
  const [streamURL, setStreamURL] = useState<string | null>(null);

  useEffect(() => {
    function fetchAllMovies() {
      axios
        .get("/api/movies/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          let movies: Movie[] = response.data;
          if (profile.age < 12) {
            movies = movies.filter(
              (movie) => movie.rating === "G" || movie.rating === "PG"
            );
          }
          setMovieData(movies);
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    }

    if (firstAppearance) {
      setFirstAppearance(false);
      fetchAllMovies();
    }
  }, [firstAppearance, profile]);

  async function playMovie(movie: Movie) {
    try {
      const token = localStorage.getItem("token") ?? "";
      const response = await axios.get<SignedUrlResponse>(
        `/api/movies/secure-url/${movie.videoURL}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStreamURL(response.data.signedUrl);
      setMovieClicked(movie);
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      alert("Failed to fetch movie stream. Please try again.");
    }
  }

  return (
    <div
      className={`pt-10 w-screen min-h-screen bg-cover bg-center bg-fixed transition-opacity duration-100 ${
        firstAppearance ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: "url('/star_destroyer.png')" }}
    >
      <Logout />

      <div className="flex">
        {/** Left Sidebar */}
        <div className="fixed left-0 top-1/2 -translate-y-1/2 max-w-56 bg-black/90 text-white border border-netflix-red flex flex-col items-center space-y-6 py-6">
          {/** Left Sidebar content goes here */}
          <div>
            <div className="pb-1">
              <img
                src="/search.svg"
                className="w-12 h-12 m-2 hover:cursor-pointer"
                alt="Search"
                onClick={() => alert("Search clicked")}
              />
            </div>
            <div className="pb-1">
              <img
                src="/home.svg"
                className="w-12 h-12 m-2 hover:cursor-pointer"
                alt="Home"
                onClick={() => alert("Home clicked")}
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

        {/** Settings Icon */}
        <div className="fixed bottom-3 left-0 m-4 w-10 h-10 cursor-pointer z-50">
          <img
            src="/settings.svg"
            alt="Profile"
            onClick={() => setShowSettingsTab(!showSettingsTab)}
          />
        </div>

        {/** Main Content Area */}
        <div className="flex-1 mt-12 ml-20 max-w-9/10">
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
                    {movieData
                      .filter((movie) => movie.genre === category)
                      .map((movie) => (
                        <div
                          key={movie.id}
                          className="w-60 h-80 flex-shrink-0 rounded-2xl hover:cursor-pointer border-2 border-transparent hover:border-netflix-red overflow-hidden"
                          onClick={() => playMovie(movie)}
                        >
                          <div className="w-full h-full">
                            <MoviePoster
                              filename={movie.moviePoster}
                              title={movie.title}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSettingsTab && (
        <div className="fixed top-0 left-0 w-64 h-full bg-netflix-lighter/90 text-white p-4 shadow-lg border-r border-r-netflix-red">
          <div className="flex flex-col">
            <button
              className="fixed top-4 left-4 max-w-7/10 bg-netflix-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => nav("/profiles", { state: { email } })}
            >
              Switch Profile
            </button>
            <div className="mt-12">
              <h2 className="text-left text-xl font-bold mb-4">Settings</h2>
              <p className="text-left">Settings content goes here...</p>
            </div>
          </div>
        </div>
      )}

      {movieClicked && streamURL && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="w-full max-w-4xl bg-black rounded-2xl shadow-lg p-4">
            <video
              className="w-full rounded-xl"
              controls
              autoPlay
              preload="metadata"
            >
              <source src={streamURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setMovieClicked(null);
                setStreamURL(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Browse;
