import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Logout from "../Login/logout";

/**
 * Admin Features Components
 * Promote Users to Admin (connected to UserService)
 * View System Logs
 * Manage Content (connected to MovieService)
 */

interface Movie {
  title: string;
  director: string;
  description?: string;
  releaseDate?: string;
  genre: string;
  rating?: string;
  moviePoster?: string;
  videoURL?: string;
}

// interface User {
//   userName?: string;
//   email: string;
//   password?: string;
//   phoneNum?: string;
//   dob?: string;
// }

function Admin() {
  const nav = useNavigate();
  const loc = useLocation();
  const email: string = loc.state?.email;
  const admin: boolean = loc.state?.admin;

  // Movie variables
  // const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    title: "",
    director: "",
    genre: "",
    releaseDate: "",
    rating: "",
    moviePoster: "",
    videoURL: "",
    description: "",
  });

  const movieRating: string[] = [
    "G",
    "PG",
    "PG-13",
    "R",
    "NC-17",
    "Not Rated",
    "Unrated",
  ];
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

  useEffect(() => {
    if (admin == null || !admin) {
      const timer = setTimeout(() => {
        nav("/", { state: { email } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [admin, nav, email]);

  function handleAddMovie(e: React.FormEvent) {
    e.preventDefault();
    axios
      .post("/api/movies/add", newMovie, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        alert(response.data.message || "Movie added successfully!");
        setNewMovie({
          title: "",
          director: "",
          genre: "",
          releaseDate: "",
          rating: "",
          moviePoster: undefined,
          videoURL: undefined,
          description: "",
        });
      })
      .catch((error) => {
        console.error("Error adding movie:", error);
        alert("Failed to add movie. Please try again.");
      });
  }

  return (
    <div>
      {admin ? (
        <div>
          <Logout />

          {/* Example: Form to add new movie */}
          <div className="max-w-6/10 min-w-1/10 flex flex-col items-center mx-auto mt-10 p-6 border rounded shadow">
            <form onSubmit={handleAddMovie}>
              <h2 className="text-2xl font-bold mb-4">Add New Movie</h2>
              <input
                type="text"
                placeholder="Title"
                className="border p-2 mb-2 w-full"
                required
                value={newMovie.title}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Director"
                className="border p-2 mb-2 w-full"
                required
                value={newMovie.director}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, director: e.target.value })
                }
              />
              <select
                className="border p-2 mb-2 w-full"
                required
                value={newMovie.genre}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, genre: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Genre
                </option>
                {movieCategories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="text-black"
                  >
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Release Date (YYYY-MM-DD)"
                className="border p-2 mb-2 w-full"
                required
                value={newMovie.releaseDate}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, releaseDate: e.target.value })
                }
              />
              <select
                className="border p-2 mb-2 w-full"
                required
                value={newMovie.rating}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, rating: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Rating
                </option>
                {movieRating.map((rating) => (
                  <option key={rating} value={rating} className="text-black">
                    {rating}
                  </option>
                ))}
              </select>
              <div>
                <div className="text-left">Movie Poster File</div>
                <input
                  type="file"
                  className="border p-2 mb-2 w-full"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewMovie({
                        ...newMovie,
                        moviePoster: e.target.files[0].name,
                      });
                    }
                  }}
                />
              </div>
              <div>
                <div className="text-left">Movie Video File</div>
                <input
                  type="file"
                  className="border p-2 mb-2 w-full"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewMovie({
                        ...newMovie,
                        videoURL: e.target.files[0].name,
                      });
                    }
                  }}
                />
              </div>
              <textarea
                placeholder="Description"
                className="border p-2 mb-2 w-full"
                required
                value={newMovie.description}
                onChange={(e) =>
                  setNewMovie({ ...newMovie, description: e.target.value })
                }
              ></textarea>
              <button
                type="submit"
                className="bg-netflix-red text-white p-2 rounded w-full"
              >
                Add Movie
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center mt-20">
            Access Denied
          </h1>
          <p className="text-center mt-4">
            You do not have permission to view this page.
          </p>
          <p className="text-center mt-2 text-gray-500">
            Redirecting you in 3 seconds...
          </p>
        </div>
      )}
    </div>
  );
}

export default Admin;
