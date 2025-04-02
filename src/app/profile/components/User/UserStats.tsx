"use client";
import { useUserStore } from "@/store/useUserStore";

export default function UserStats() {
  const { streamingHistory, following, playlists } = useUserStore();

  const stats = [
    { label: "Songs Played", count: streamingHistory.length },
    { label: "Artists Followed", count: following },
    { label: "Public Playlists", count: playlists.length },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full max-w-2xl mx-auto">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-black border border-white/10 rounded-2xl p-5 text-center shadow-lg
          transition-transform duration-300 hover:-translate-y-2 hover:ring hover:ring-purple-500/40"
        >
          <h3 className="text-3xl font-semibold mb-1 text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text">
            {stat.count}
          </h3>

          <p className="text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
