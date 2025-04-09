"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { FaArrowLeft } from "react-icons/fa";

export default function CreateAlbumPage() {
  const { user_id } = useUserStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [albumArt, setAlbumArt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Album title is required");

    setLoading(true);
    try {
      const res = await fetch("/api/albums/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          album_art: albumArt || undefined,
          user_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create album");
      } else {
        router.push(`/albums/${data.album_id}`);
      }
    } catch (err) {
      console.error("Error creating album:", err);
      alert("Something went wrong while creating the album.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="self-start mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-2"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-4xl font-bold mb-6">🎶 Create a New Album</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-900 p-8 rounded-xl shadow-xl space-y-6"
      >
        <div>
          <label className="block mb-2 font-semibold">Album Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
            placeholder="My New Album"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Album Art URL (optional)</label>
          <input
            type="text"
            value={albumArt}
            onChange={(e) => setAlbumArt(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white font-semibold py-2 rounded-md transition-all"
        >
          {loading ? "Creating..." : "➕ Create Album"}
        </button>
      </form>
    </div>
  );
}
