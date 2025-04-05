"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import TopTracks from "@/app/profile/components/User/TopTracks";
import TopArtists from "@/app/profile/components/User/TopArtists";
import UserPlaylists from "@/app/profile/components/User/UserPlaylists";
import Sidebar from "@/components/ui/Sidebar";
import NavBar from "@/components/ui/NavBar";

export default function ListenerUserProfile() {
  const {
    username,
    pfp,
    role,
    playlistCount,
    followers,
    following,
    setUser,
    setLikedSongs,
    setPlaylists,
    setStreamingHistory,
    setTopTracks,
    setFollowers,
    setFollowing,
  } = useUserStore();

  useEffect(() => {
    async function fetchUserData() {
      const res = await fetch("/api/user/me", { cache: "no-store" });
      if (!res.ok) return;

      const data = await res.json();
      setUser(data.username, data.role, data.pfp, data.user_id);
      setLikedSongs(data.likedSongs);
      setPlaylists(data.playlists);
      setStreamingHistory(data.streamingHistory);
      setTopTracks(data.topTracks);
      setFollowers(data.followers);
      setFollowing(data.following);
    }

    fetchUserData();
  }, [
    setUser,
    setLikedSongs,
    setPlaylists,
    setStreamingHistory,
    setTopTracks,
    setFollowers,
    setFollowing,
  ]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role={role as "listener" | "artist" | "admin"} />
        <main className="p-6 space-y-10">
          <div className="flex gap-6 items-center">
            <img
              src={pfp || "/default-pfp.jpg"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-xl"
            />
            <div>
              <p className="text-sm uppercase text-gray-400 font-semibold">
                Profile
              </p>
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

          <section>
            <h2 className="text-2xl font-bold mb-4">Top artists this month</h2>
            <TopArtists />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Top tracks this month</h2>
            <TopTracks />
          </section>

          <section>
            <UserPlaylists />
          </section>
        </main>
      </div>
    </div>
  );
}
