import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  userName?: string;
  email: string;
  password: string;
  phoneNum?: string;
  dob?: string;
}

function Register() {
  let user: User;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [dob, setDob] = useState("");
  const nav = useNavigate();

  async function handleRegister() {
    user = {
      userName,
      email,
      password,
      phoneNum,
      dob,
    };

    await axios
      .post("/api/users/register", user)
      .then(() => {
        alert("Registration successful");
        nav("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-black text-netflix-white">
      <div className="bg-gray-800/50 p-10 rounded-md w-full max-w-md border border-black">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <input
            className="p-3 rounded text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red border border-netflix-white"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            className="p-3 rounded text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red border border-netflix-white"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-3 rounded text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red border border-netflix-white"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="p-3 rounded text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red border border-netflix-white"
            type="tel"
            placeholder="Phone Number"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
          <input
            className="p-3 rounded text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red border border-netflix-white"
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button
            type="submit"
            className="bg-netflix-red hover:bg-red-800 transition-colors py-3 rounded font-bold mt-4"
          >
            Register
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 transition-colors py-3 rounded font-bold"
            type="button"
            onClick={() => nav("/login")}
          >
            Return
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
