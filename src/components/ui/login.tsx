"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

function SuccessModal({
  message,
  onContinue,
}: {
  message: string;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="neon-card relative flex flex-col items-center w-full max-w-sm p-6 rounded-2xl shadow-2xl space-y-4 border-4 border-black animate-gradient">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          {message}
        </h2>
        <button
          onClick={onContinue}
          className="mt-2 px-6 py-2 text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-lg hover:scale-105 transition-all duration-200 glow-button"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const store = useUserStore.getState();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [nextPath, setNextPath] = useState("/home");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    store.logout();
    document.cookie = "user_id=; Max-Age=0; path=/;";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const loginData = await res.json();
      if (!res.ok) throw new Error(loginData.error || "Invalid credentials");

      const userRes = await fetch("/api/user/me", { credentials: "include" });
      const userData = await userRes.json();
      if (!userRes.ok) throw new Error("Failed to load user data");

      store.setUser(userData.username, userData.role, userData.pfp || "", userData.user_id);
      store.setLikedSongs(userData.likedSongs || []);
      store.setPlaylists(userData.playlists || []);
      store.setStreamingHistory(userData.streamingHistory || []);
      store.setTopTracks(userData.topTracks || []);
      store.setFollowedArtists(userData.topArtists || []);
      store.setFollowers(userData.followers?.length || 0);
      store.setFollowing(userData.following?.length || 0);

      let dest = "/home";
      if (userData.role === "artist") dest = "/profile/user";
      else if (userData.role === "admin") dest = "/reportadmin";

      setNextPath(dest);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccess(false);
    router.push(nextPath);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="neon-card flex flex-col items-center w-full max-w-md p-8 rounded-2xl shadow-2xl space-y-6 border-4 border-black animate-gradient">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Log in to Amplifi
        </h1>

        {error && <p className="text-red-500 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white rounded-lg hover:scale-105 transition-all duration-300 glow-button"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          New to Amplifi?{" "}
          <Link
            href="/signup"
            className="relative text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-purple-400 before:via-blue-400 before:to-white before:opacity-0 hover:before:opacity-100"
          >
            Join the party!
          </Link>
        </p>
      </div>

      {showSuccess && (
        <SuccessModal
          message="Login successful! Welcome to Amplifi 🎧"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
