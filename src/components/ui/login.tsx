"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ First authenticate
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const loginData = await res.json();
      if (!res.ok) throw new Error(loginData.error || "Invalid credentials");

      // ✅ Set Zustand user_id, username, and role
      const store = useUserStore.getState();
      store.setUser(loginData.user_id, loginData.username, loginData.role);
      console.log("👤 Zustand user_id set to:", loginData.user_id);

      // ✅ Then fetch extra data (liked songs, playlists, etc.)
      const userRes = await fetch("/api/user/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginData.username }),
      });

      const userData = await userRes.json();
      if (!userRes.ok) throw new Error("Failed to load user data");

      store.setLikedSongs(userData.likedSongs);
      store.setPlaylists(userData.playlists);
      store.setStreamingHistory(userData.streamingHistory);

      alert("Login successful! Welcome to Amplifi 🎧");

      // redirect
      if (loginData.role === "listener") router.push("/home");
      else if (loginData.role === "artist") router.push("/artistprofile");
      else router.push("/home");

    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="neon-card relative flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl shadow-lg space-y-6 border border-gray-800 animate-gradient">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in-up">
          Log in to Amplifi
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          New to Amplifi?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Join the party!
          </Link>
        </p>
      </div>
    </div>
  );
}
