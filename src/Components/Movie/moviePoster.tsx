import { useEffect, useState } from "react";
import axios from "axios";

interface Poster {
  filename: string;
  title: string;
}

function MoviePoster({ filename, title }: Poster) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`/api/movies/poster/${filename}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      setPosterUrl(URL.createObjectURL(res.data));
    })
    .catch((error) => {
      setPosterUrl(null);
      console.error("Error fetching poster URL:", error);
    });
  }, [filename]);

  if (!posterUrl) {
    return <div>Loading...</div>;
  }

  return <img src={posterUrl} alt={title} className="w-60 h-80 rounded-2xl" />;
}

export default MoviePoster;
