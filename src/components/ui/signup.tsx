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
      <div className="neon-card flex flex-col items-center w-full max-w-sm p-6 rounded-2xl shadow-2xl space-y-4 border-4 border-black animate-gradient">
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

export default function Signup() {
  const router = useRouter();
  const store = useUserStore.getState();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // modal control
  const [showSuccess, setShowSuccess] = useState(false);
  const [nextPath, setNextPath] = useState("/");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!formData.role) {
      setError("Please select a role.");
      return;
    }

    setLoading(true);

    try {
      const signupRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.error || "Signup failed");

      store.logout();
      localStorage.removeItem("user-storage");

      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      if (!loginRes.ok) throw new Error("Auto-login failed");

      const extraRes = await fetch("/api/user/me", {
        method: "GET",
        credentials: "include",
      });
      const extra = await extraRes.json();
      if (!extraRes.ok) throw new Error(extra.error || "Failed to load user");

      store.setUser(extra.username, extra.role, extra.pfp || "", extra.user_id);
      store.setLikedSongs(extra.likedSongs || []);
      store.setPlaylists(extra.playlists || []);
      store.setStreamingHistory(extra.streamingHistory || []);
      store.setTopTracks(extra.topTracks || []);
      store.setFollowedArtists(extra.topArtists || []);
      store.setFollowers(extra.followers?.length || 0);
      store.setFollowing(extra.following?.length || 0);

      let dest = "/";
      if (extra.role === "listener") dest = "/home";
      else if (extra.role === "artist") dest = "/profile/user";
      else if (extra.role === "admin") dest = "/reportadmin";

      setNextPath(dest);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
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
          Sign up for Amplifi
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />
          <input
            type="text"
            name="username"
            placeholder="Create Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />

          <h2 className="text-center text-lg font-semibold bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-4">
            Decide your fate...
          </h2>
          <div className="flex justify-between gap-4 mt-2">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, role: "listener" })
              }
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                formData.role === "listener"
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              I’m a Listener 🎧
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "artist" })}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                formData.role === "artist"
                  ? "bg-gradient-to-r from-purple-500 via-blue-400 to-pink-500"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              I’m an Artist 🎤
            </button>
          </div>

          {error && <p className="text-red-500 font-medium text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-lg font-semibold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white rounded-lg hover:scale-105 transition-all duration-300 glow-button"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="relative text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-purple-400 before:via-blue-400 before:to-white before:opacity-0 hover:before:opacity-100"
          >
            Log in here!
          </Link>
        </p>
      </div>

      {showSuccess && (
        <SuccessModal
          message="Signup successful! Welcome to Amplifi 🎧"
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
