"use client";
import Image from "next/image";
import { useUserStore } from "@/app/store/userStore"; // Import Zustand store

export default function ArtistCard() {
  const { username} = useUserStore(); // Retrieve username and artist status from store

  return (
    <div className="relative w-full bg-black p-8">
      <div className="flex items-center gap-6 mt-8">
        {/* Avatar */}
        <Image
          src="/ed.jpeg"
          alt="Artist Avatar"
          width={120}
          height={120}
          className="rounded-full object-cover border-4 border-black shadow-md"
          priority
        />

        {/* Text Info */}
        <div className="flex flex-col">
          {/* Small label above the username */}
          <span className="text-white text-sm uppercase tracking-wide mb-1">
          </span>

          {/* Artist/Username */}
          <h2 className="text-5xl font-extrabold text-white leading-none">
            {username || "Artist Name"}
          </h2>

          {/* Additional stats row */}
            <p className="text-white text-sm mt-2">
              32 Tracks • 5 Albums • 10,000 Followers
            </p>
        </div>
      </div>
    </div>
  );
}
