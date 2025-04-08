"use client";

import { useUserStore } from "@/store/useUserStore";
import ChangeProfilePic from "@/components/ui/changepfp";
import { useEffect } from "react";

export default function UserCard() {
  const {
    username,
    pfp,
    followers,
    following,
    playlistCount,
    userId,
    setPfp,
  } = useUserStore();

  useEffect(() => {
    const loadUserData = async () => {
      if (userId === null) return;
      const response = await fetch(`/api/user/${userId}`);
      const userData = await response.json();
      setPfp(userData.pfp);
    };
    loadUserData();
  }, [userId, setPfp]);

  return (
    <div className="relative w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 px-10 py-12 rounded-b-xl shadow-md">
      <div className="flex items-center gap-8">
        {/* ✅ Only render when userId is not null */}
        {userId !== null && (
          <ChangeProfilePic
            currentPfp={pfp || "/default_pfp.jpg"}
            userId={userId}
            onUploadComplete={(url) => setPfp(url)}
          />
        )}

        <div className="flex flex-col gap-2">
          <span className="text-white text-sm uppercase tracking-wider">
            Profile
          </span>
          <h1 className="text-6xl font-extrabold text-white">
            {username || "User"}
          </h1>

          <p className="text-white mt-1 text-sm sm:text-base">
            {playlistCount} Public Playlists • {followers} Followers • {following} Following
          </p>
        </div>
      </div>
    </div>
  );
}
