"use client";

import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

interface ArtistCardProps {
  albumCount: number;
  songCount: number;
}

export default function ArtistCard({ albumCount, songCount }: ArtistCardProps) {
  const { username, pfp } = useUserStore();

  return (
    <div className="relative w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 px-10 py-12 rounded-b-xl shadow-md">
      <div className="flex items-center gap-8">
        {/* Avatar */}
        <div className="w-40 h-40 rounded-full bg-black border-4 border-white overflow-hidden shadow-xl">
          <Image
            src={pfp || "/artist-default.jpg"}
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
            {songCount} {songCount === 1 ? "Track" : "Tracks"} •{" "}
            {albumCount} {albumCount === 1 ? "Album" : "Albums"}
          </p>
        </div>
      </div>
    </div>
  );
}
