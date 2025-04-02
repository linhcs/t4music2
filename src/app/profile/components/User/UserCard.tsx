"use client";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

export default function UserCard() {
  const { username } = useUserStore(); // Retrieve username from store

  return (
    <div className="relative w-full bg-black p-8">
      <div className="flex items-center gap-6 mt-8">
        {/* Avatar */}
        <Image
          src="/ed.jpeg"
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full object-cover border-4 border-black shadow-md"
          priority
        />

        {/* Text Info */}
        <div className="flex flex-col">
          {/* Small label above the username */}
          <span className="text-white text-sm uppercase tracking-wide mb-1">
            Profile
          </span>

          {/* Username (same as ListenerHome approach) */}
          <h2 className="text-5xl font-extrabold text-white leading-none">
            {username ? username : "User"}
          </h2>

          {/* Additional stats row */}
          <p className="text-white text-sm mt-2">
            16 Public Playlists • 2 Followers • 2 Following
          </p>
        </div>
      </div>
    </div>
  );
}
