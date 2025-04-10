"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function ArtistUserStats() {
  const { user_id, followers, following } = useUserStore();
  const [songsCount, setSongsCount] = useState(0);
  const [albumsCount, setAlbumsCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [songsRes, albumsRes] = await Promise.all([
          fetch(`/api/songs/artist/${user_id}`),
          fetch(`/api/albums/user/${user_id}`),
        ]);
        const songs = await songsRes.json();
        const albums = await albumsRes.json();

        setSongsCount(songs.length || 0);
        setAlbumsCount(albums.length || 0);
      } catch (err) {
        console.error("Failed to load artist stats", err);
      }
    }

    if (user_id) fetchStats();
  }, [user_id]);

  const stats = [
    { label: "Followers", count: followers },
    { label: "Following", count: following },
    { label: "Songs Uploaded", count: songsCount },
    { label: "Albums Created", count: albumsCount },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full max-w-4xl">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-gray-900 rounded-xl p-5 shadow-xl text-center hover:bg-gray-800 transition"
        >
          <h3 className="text-3xl font-semibold mb-1">{stat.count}</h3>
          <p className="text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
