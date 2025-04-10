"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { createPlaylist } from "@/app/actions/createPlaylist";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import CreatePlaylistModal from "./CreatePlaylistModal";
import PlayBar from "@/components/ui/playBar";
import { useAudioPlayer } from "@/context/AudioContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Playlist = {
  playlist_id: number | "liked";
  name: string;
  playlist_art?: string;
  isLiked?: boolean;
};

export default function UserPlaylists() {
  const {
    username,
    isLoggedIn,
    user_id,
    likedSongs,
    setPlaylists: setGlobalPlaylists,
  } = useUserStore();

  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { currentSong, isPlaying, progress, togglePlayPause, handleSeek } =
    useAudioPlayer();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    async function fetchPlaylists() {
      const res = await fetch(`/api/playlists/user/${username}`);
      const data: Playlist[] = await res.json();
      const cleaned = data.filter((p) => p.playlist_id !== "liked");
      setPlaylists(cleaned);
      setGlobalPlaylists(cleaned);
    }

    if (isLoggedIn) fetchPlaylists();
  }, [username, isLoggedIn, setGlobalPlaylists]);

  const handleCreatePlaylist = async (name: string, playlist_art: string) => {
    if (user_id !== null) {
      const newPlaylist = await createPlaylist(name, user_id, playlist_art);
      const updated = [...playlists, newPlaylist];
      setPlaylists(updated);
      setGlobalPlaylists(updated);
    }
  };

  const handleDelete = async (playlistId: number | "liked") => {
    if (playlistId === "liked") return;

    const confirm = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirm) return;

    const res = await fetch(`/api/playlists/${playlistId}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed to delete playlist");

    alert("🗑️ Playlist deleted!");
    const updated = playlists.filter((p) => p.playlist_id !== playlistId);
    setPlaylists(updated);
    setGlobalPlaylists(updated);
  };

  return (
    <div className="mt-10 w-full relative">
      {/* Scroll Arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black p-2 rounded-full"
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black p-2 rounded-full"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>

      {/* Playlist Scroll Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-2 pr-10 p1-2"
      >
        {/* Liked Songs */}
        {likedSongs.length > 0 && (
          <Link href="/playlists/liked">
            <div
              key="liked"
              className="min-w-[200px] max-w-[200px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center py-4"
            >
              <div className="h-36 w-36 bg-gray-800 rounded-xl overflow-hidden">
                <Image
                  src="/likedsong/liked_songs.jpg"
                  alt="Liked Songs"
                  width={144}
                  height={144}
                  className="rounded-xl object-cover"
                />
              </div>
              <p className="text-center py-3 font-semibold">💗 Liked Songs</p>
              <p className="text-sm text-white/60">{likedSongs.length} songs</p>
            </div>
          </Link>
        )}

        {/* User's Playlists */}
        {playlists.map((playlist) => (
          <div
            key={playlist.playlist_id}
            className="relative group min-w-[200px] max-w-[200px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center py-4"
          >
            <button
              onClick={() => handleDelete(playlist.playlist_id)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              title="Delete playlist"
            >
              <FaTrashAlt size={14} />
            </button>

            <Link
              href={`/playlists/${playlist.playlist_id}`}
              className="flex flex-col items-center"
            >
              <div className="h-36 w-36 bg-gray-800 rounded-xl overflow-hidden">
                <Image
                  src={playlist.playlist_art || "/albumArt/defaultAlbumArt.png"}
                  alt={playlist.name}
                  width={144}
                  height={144}
                  className="rounded-xl object-cover"
                />
              </div>
              <p className="text-center py-3 font-semibold">{playlist.name}</p>
            </Link>
          </div>
        ))}

        {/* Add Playlist */}
        <button onClick={() => setShowModal(true)}>
          <div className="min-w-[180px] max-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-4">
            <div className="h-36 w-36 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-400 animate-gradient rounded-xl flex items-center justify-center">
              <FaPlus size={48} className="text-white" />
            </div>
            <p className="text-center py-3 font-semibold">Add Playlist</p>
          </div>
        </button>
      </div>

      {showModal && (
        <CreatePlaylistModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreatePlaylist}
        />
      )}

      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && togglePlayPause()}
        onSeek={handleSeek}
      />
    </div>
  );
}
