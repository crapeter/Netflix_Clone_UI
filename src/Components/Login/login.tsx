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

function Login() {
  let user: User;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  async function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    user = {
      email,
      password,
    };

    await axios
      .post("/api/users/login", user)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        } else {
          console.log("Login failed: Invalid credentials");
        }
      })
      .catch((err) => {
        console.error(err);
      });

    await axios
      .get(`/api/users/${email}/isAdmin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (response.data.isAdmin) {
          nav("/admin", {
            state: { email: email, admin: response.data.isAdmin },
          });
        } else {
          nav("/profiles", { state: { email: user.email } });
        }
      })
      .catch((error) => {
        console.error("Error checking admin status:", error);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-black text-netflix-white">
      <div className="bg-gray-800/50 p-10 rounded-md w-full max-w-md border border-black">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold" htmlFor="email">
              Email:
            </label>
            <input
              className="p-3 rounded bg-gray-400 text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold" htmlFor="password">
              Password:
            </label>
            <input
              className="p-3 rounded bg-gray-400 text-netflix-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button
            className="bg-netflix-red hover:bg-red-800 transition-colors py-3 rounded font-bold mt-4"
            type="submit"
          >
            Login
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 transition-colors py-3 rounded font-bold mt-4"
            onClick={() => nav("/register")}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
