import { useState, useEffect } from "react";
import type { Movie } from "../../Types/Index";
import axios from "axios";

import MoviePoster from "./moviePoster";

interface SignedUrlResponse {
  signedUrl: string;
}

function MovieTab({ movie }: { movie: Movie }) {
  const [movieClicked, setMovieClicked] = useState<Movie | null>(null);
  const [streamURL, setStreamURL] = useState<string | null>(null);

  useEffect(() => {
    if (movieClicked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [movieClicked]);

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
    <div className="flex flex-col content-center max-w-2/3 min-w-1/2 mx-auto p-4 rounded-2xl shadow-lg space-y-6 bg-netflix-black border-black border-2">
      <div className="text-left w-full h-full text-white space-y-2">
        <MoviePoster filename={movie.moviePoster} title={movie.title} />
        <h1 className="text-2xl font-bold">{movie.title}</h1>
        <p className="text-sm text-gray-400">
          Directed by {movie.director} · {movie.genre} · Rated {movie.rating}
        </p>
        <p className="text-gray-300">{movie.description}</p>
      </div>

      <button
        className="mt-4 bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg font-semibold shadow-md"
        onClick={() => playMovie(movie)}
      >
        ▶ Play
      </button>

      {movieClicked && streamURL && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-35">
          <div className="relative w-full max-w-4xl bg-netflix-black rounded-2xl shadow-xl p-1 transform transition-all duration-300 scale-95 hover:scale-100">
            <button
              onClick={() => {
                setMovieClicked(null);
                setStreamURL(null);
              }}
              className="absolute top-0 right-0 text-white bg-black/60 hover:bg-black/80 hover:cursor-pointer rounded-full p-2 z-50"
            >
              ✕
            </button>

            <video
              className="w-full rounded-xl"
              controls
              autoPlay
              preload="metadata"
            >
              <source src={streamURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieTab;