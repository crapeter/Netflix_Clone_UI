import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./Components/AuthContext";
import Profiles from "./Components/Login/profiles";
import Login from "./Components/Login/login";
import Register from "./Components/Login/register";
import Browse from "./Components/Browsing/browse";
import Admin from "./Components/AdminFeatures/admin";

function App() {
  return (
    <AuthProvider>
      <div className="App absolute top-0 left-0 w-full h-full bg-netflix-black text-netflix-white overflow-auto">
        {/* Logo */}
        <div className="fixed top-4 left-4 text-5xl font-extrabold text-netflix-red tracking-wider shadow-lg">
          TechFlix
        </div>

        {/* Routes */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>

        {/* Vignettes */}
        <div className="fixed top-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-b from-black/80 to-transparent z-50"></div>
        <div className="fixed bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-black/80 to-transparent z-50"></div>
      </div>
    </AuthProvider>
  );
}

export default App;
