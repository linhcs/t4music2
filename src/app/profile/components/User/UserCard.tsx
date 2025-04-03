"use client";

import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

export default function UserCard() {
  const { username, pfp, followers, following, playlistCount } = useUserStore();

  return (
    <div className="relative w-full bg-black px-10 py-12 rounded-b-xl shadow-md border-b border-gray-800">
      <div className="flex items-center gap-8">
        {/* profile avatar */}
        <div className="w-40 h-40 rounded-full bg-black border-4 border-white overflow-hidden shadow-xl">
          <Image
            src={pfp || "/default-pfp.jpg"}
            alt="User Avatar"
            width={160}
            height={160}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-white text-sm uppercase tracking-wider">Profile</span>

          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-500 to-blue-500 animate-gradient drop-shadow-md">
            {username || "User"}
          </h1>

          {/* stats */}
          <p className="text-white mt-1 text-sm sm:text-base">
            {playlistCount} Public Playlists • {followers} Followers • {following} Following
          </p>
        </div>
      </div>
    </div>
  );
}
