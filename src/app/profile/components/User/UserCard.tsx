"use client";

import { useUserStore } from "@/store/useUserStore";
import ChangeProfilePic from "@/components/ui/changepfp";
import { useEffect, useState } from "react";

export default function UserCard() {
  const {
    username,
    pfp,
    followers,
    following,
    playlistCount,
    user_id,
    role,
    setPfp,
  } = useUserStore();

  const [songCount, setSongCount] = useState<number>(0);
  const [albumCount, setAlbumCount] = useState<number>(0);

  useEffect(() => {
    const loadUserData = async () => {
      if (user_id === null) return;

      try {
        const response = await fetch(`/api/user/${user_id}`);

        if (!response.ok) {
          console.error(`Error loading user data: ${response.status}`);
          return;
        }

        const userData = await response.json();
        if (userData?.pfp) {
          setPfp(userData.pfp);
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };

    loadUserData();
  }, [user_id, setPfp]);

  useEffect(() => {
    const fetchArtistStats = async () => {
      if (role !== "artist" || !user_id) return;

      try {
        const [songsRes, albumsRes] = await Promise.all([
          fetch(`/api/songs/artist/${user_id}`),
          fetch(`/api/albums/user/${user_id}`),
        ]);

        const songs = await songsRes.json();
        const albums = await albumsRes.json();

        setSongCount(songs.length);
        setAlbumCount(albums.length);
      } catch (err) {
        console.error("Failed to fetch artist stats:", err);
      }
    };

    fetchArtistStats();
  }, [role, user_id]);

  return (
    <div className="relative">
      <div className="flex items-center gap-8">
        {user_id !== null && (
          <ChangeProfilePic
            currentPfp={pfp || "/default_pfp.jpg"}
            userId={user_id}
            onUploadComplete={(url) => setPfp(url)}
          />
        )}
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm uppercase text-gray-400 font-semibold">
              Profile
            </p>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              {username || "Loading..."}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
              <p>{followers} followers</p>
              <p>{following} following</p>
              <p>{playlistCount || 0} playlists</p>
              {role === "artist" && (
                <>
                  <p>{songCount} songs</p>
                  <p>{albumCount} albums</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
