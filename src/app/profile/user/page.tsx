"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import TopTracks from "@/app/profile/components/User/TopTracks";
import TopArtists from "@/app/profile/components/User/TopArtists";
import UserPlaylists from "@/app/profile/components/User/UserPlaylists";
import Sidebar from "@/components/ui/Sidebar";
import NavBar from "@/components/ui/NavBar";
import { useAudioPlayer } from "@/context/AudioContext";
import PlayBar from "@/components/ui/playBar";
import ChangeProfilePic from "@/components/ui/changepfp";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import cuteAnimation from "@/assets/cute_animation.json";

export default function ListenerUserProfile() {
  const {
    username,
    pfp,
    // role,
    playlistCount,
    followers,
    following,
    user_id,
    setUser,
    setLikedSongs,
    setPlaylists,
    setStreamingHistory,
    setTopTracks,
    setFollowers,
    setFollowing,
    setPfp,
    setPlaylistCount,
  } = useUserStore();

  const { currentSong, isPlaying, progress, playSong } = useAudioPlayer();
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      setFollowers(data.followers.length);
      setFollowing(data.following.length);
      setPlaylistCount(data.playlists.length);
      setPfp(data.pfp);
      setLoading(false);
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
    setPlaylistCount,
    setPfp,
  ]);

  if (!hasMounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-64 h-64">
          <Lottie animationData={cuteAnimation} loop />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar />
        <main className="p-6 space-y-10">
          <div className="flex gap-6 items-center">
        <ChangeProfilePic
          currentPfp={pfp || "/default_pfp.jpg"}
          userId={user_id? user_id : 1}
          onUploadComplete={(url) => setPfp(url)}
          />
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

      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && playSong(currentSong)}
        onSeek={(e) => {
          if (!currentSong) return;
          const bar = e.currentTarget;
          const percent = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
          const currentTime = percent * currentSong.duration;
          console.log(currentTime)// can be deleted later
           playSong(currentSong);
        }}
      />
    </div>
  );
}
