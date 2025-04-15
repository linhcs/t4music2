"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import TopTracks from "@/app/profile/components/User/TopTracks";
import ArtistTopTracks from "../components/Artist/ArtistTopTracks";
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
import ArtistAlbums from "../components/Artist/ArtistAlbums";
import UserCard from "../components/User/UserCard";
import ArtistSongs from "../components/Artist/ArtistSongs";
import { FaChartLine, FaChartBar } from "react-icons/fa";
import Link from "next/link";
import CreatePlaylistModal from "../components/User/CreatePlaylistModal";
console.log(CreatePlaylistModal);
console.log(ChangeProfilePic);
console.log(ArtistSongs, ArtistTopTracks, ArtistAlbums); // feel free to delete later
export default function ListenerUserProfile() {
  const {
    role,
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

  const {
    currentSong,
    isPlaying,
    progress,
    playSong,
    handleSeek,
    volume,
    setVolume,
  } = useAudioPlayer();

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
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar />
        <main className="p-6 space-y-10">
          <div className="flex gap-6 items-center">
            <UserCard />
          </div>

          {role === "listener" && (
            <>
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Your top artists this month
                </h2>
                <TopArtists />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
                <TopTracks />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">My Playlists</h2>
                <UserPlaylists />
              </section>
            </>
          )}

          {role === "artist" && (
            <>
              <section>
                <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
                <ArtistTopTracks />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">♫ My Uploaded Songs</h2>
                <ArtistSongs />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">My Albums</h2>
                <ArtistAlbums />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">My Playlists</h2>
                <UserPlaylists />
              </section>
            </>
          )}

          <div className="mt-8 flex justify-center gap-4 pb-36">
            <Link
              href="/report"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              <FaChartLine />
              <span>View Your Music Journey</span>
            </Link>

            {role === "artist" && (
              <Link
                href="/artist-report"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-orange-700 transition-all duration-300"
              >
                <FaChartBar />
                <span>Artist Dashboard</span>
              </Link>
            )}
          </div>
        </main>
      </div>

      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && playSong(currentSong)}
        onSeek={handleSeek}
        volume={volume}
        setVolume={setVolume}
      />
    </div>
  );
}
