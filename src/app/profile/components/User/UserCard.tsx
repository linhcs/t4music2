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
    user_id,
    setPfp,
  } = useUserStore();

  useEffect(() => {
    const loadUserData = async () => {
      if (user_id === null) return;
      const response = await fetch(`/api/user/${user_id}`);
      const userData = await response.json();
      setPfp(userData.pfp);
    };
    loadUserData();
  }, [user_id, setPfp]);

  return (
    <div className="relative">
      <div className="flex items-center gap-8 ">
        {user_id !== null && (
          <ChangeProfilePic
            currentPfp={pfp || "/default_pfp.jpg"}
            userId={user_id}
            onUploadComplete={(url) => setPfp(url)}
          />
        )}
              <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm uppercase text-gray-400 font-semibold">Profile</p>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                {username || "Loading..."}
              </h1>
              <div className="flex gap-4 mt-2 text-gray-400">
                <p>{followers} followers</p>
                <p>{following} following</p>
                <p>{playlistCount || 0} playlists</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
