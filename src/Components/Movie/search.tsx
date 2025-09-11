import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Profile, Movie } from "../../Types/Index";

import axios from "axios";

import MoviePoster from "./moviePoster";
import MovieTab from "./movie";
import Logout from "../Login/logout";
import Sidebar from "./sidebar";

function Search() {
  const nav = useNavigate();
  const loc = useLocation();
  const profile: Profile = loc.state?.profile;
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movieClicked, setMovieClicked] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<Movie[]>(`/api/movies/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (profile && profile.age) {
          const filteredByAge = response.data.filter((movie) => {
            if (profile.age <= 12)
              return movie.rating === "G" || movie.rating === "PG";
            return true;
          });
          setMovies(filteredByAge);
          setAllMovies(filteredByAge);
        } else {
          setMovies(response.data);
          setAllMovies(response.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies(null);
      }
    };

    fetchMovies();
  }, [profile]);

  useEffect(() => {
    if (query.trim() === "") {
      setMovies(allMovies);
      return;
    }

    const filteredMovies = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setMovies(filteredMovies);
  }, [query, allMovies]);

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-2xl space-y-6 bg-netflix-black text-white">
      <Sidebar profile={profile} email={loc.state?.email} />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Search Movies</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => nav(-1)}
            className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Return
          </button>
          <Logout />
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="w-full p-3 pl-12 rounded-lg bg-neutral-700 text-white placeholder-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
        />
        <span className="absolute left-4 top-3 text-gray-300">🔍</span>
      </div>

      {movies && movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-netflix-lighter rounded-xl overflow-hidden shadow-md hover:scale-105 hover:shadow-lg transition transform cursor-pointer"
              onClick={() => setMovieClicked(movie)}
            >
              <div className="flex justify-center mt-2">
                <MoviePoster filename={movie.moviePoster} title={movie.title} />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">
                  {movie.title}
                </h2>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {movie.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        query.length > 0 && (
          <p className="mt-6 text-gray-300">No movies found.</p>
        )
      )}

      {movieClicked && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-40">
          <div className="relative w-full max-w-3xl bg-netflix-lighter/50 rounded-2xl p-6 shadow-xl">
            <button
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
              onClick={() => setMovieClicked(null)}
            >
              ✕
            </button>
            <MovieTab movie={movieClicked} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
