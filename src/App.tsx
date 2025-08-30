// import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">Netflix Clone</h1>
      <p>Tailwind v4 + Vite + React working!</p>
      <button className="mt-6 px-6 py-3 bg-netflix-red rounded hover:brightness-125 transition">
        Start Watching
      </button>
    </div>
  );
}

export default App;
