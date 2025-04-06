"use client";

import Image from "next/image";
import { useUserStore } from "@/store/useUserStore"; // Unified path if possible

export default function ArtistCard() {
  const { username } = useUserStore();

  return (
    <div className="relative w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 px-10 py-12 rounded-b-xl shadow-md">
      <div className="flex items-center gap-8">
        {/* Avatar */}
        <div className="w-40 h-40 rounded-full bg-black border-4 border-white overflow-hidden shadow-xl">
          <Image
            src="/ed.jpeg" // You can make this dynamic via `pfp || "/default_artist.jpg"` if needed
            alt="Artist Avatar"
            width={160}
            height={160}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <span className="text-white text-sm uppercase tracking-wider">Artist</span>
          <h1 className="text-6xl font-extrabold text-white">{username || "Artist Name"}</h1>
          <p className="text-white mt-1 text-sm sm:text-base">
            32 Tracks • 5 Albums • 10,000 Followers
          </p>
        </div>
      </div>
    </div>
  );
}
