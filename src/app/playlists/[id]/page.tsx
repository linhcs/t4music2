"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AddSongModal from "@/app/profile/components/User/AddSongModal";
import Image from "next/image";
import { Song } from "@/types";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useAudioPlayer } from "@/context/AudioContext";
import { useUserStore } from "@/store/useUserStore";

interface Playlist {
  playlist_id: number;
  name: string;
  playlist_art?: string;
  playlist_songs: {
    songs: Song;
  }[];
}

export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudioPlayer();
  const { likedSongs, username } = useUserStore();
  const isLikedPlaylist = id === "liked";

  const fetchPlaylist = useCallback(async () => {
    const res = await fetch(`/api/playlists/${id}`);
    const data = await res.json();
    setPlaylist(data);
  }, [id]);

  useEffect(() => {
    if (id && !isLikedPlaylist) {
      fetchPlaylist();
    }
  }, [id, isLikedPlaylist]);

  const handleRemove = async (songId: number) => {
    const res = await fetch(`/api/playlists/${id}/remove-song`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId }),
    });

    const result = await res.json();
    if (!res.ok) return alert(result.error || "Failed to remove song");
    alert("❌ Song removed");
    fetchPlaylist();
  };

  if (!isLikedPlaylist && !playlist) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const songsToRender = isLikedPlaylist
    ? likedSongs
    : playlist?.playlist_songs.map((entry) => entry.songs) || [];

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <button
        onClick={() => router.push("/profile/user")}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Profile
      </button>

      <div className="flex gap-6 items-center">
        <Image
          src={
            isLikedPlaylist
              ? "/albumArt/liked-default.png"
              : playlist?.playlist_art || "/artist-banner.jpg"
          }
          alt="Cover"
          width={160}
          height={160}
          className="w-40 h-40 object-cover rounded shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 text-transparent bg-clip-text">
            {isLikedPlaylist ? "💗 Liked Songs" : playlist?.name}
          </h1>
          <p className="text-gray-400 mt-2">
            {username} • {songsToRender.length} songs
          </p>

          {!isLikedPlaylist && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-black font-semibold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              + Add Song
            </button>
          )}
        </div>
      </div>

      <div className="mt-10">
        {songsToRender.length === 0 ? (
          <p className="text-gray-500">No songs yet. Add some!</p>
        ) : (
          songsToRender.map((song, i) => (
            <div
              key={song.song_id}
              className="flex justify-between items-center py-4 px-4 border-b border-gray-700 bg-gray-900 rounded-lg mb-4 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 group"
            >
              <div>
                <p className="font-semibold text-lg group-hover:text-white text-gray-300">
                  {i + 1}. {song.title}
                </p>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">{song.genre}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (currentSong?.song_id === song.song_id) {
                      togglePlayPause();
                    } else {
                      playSong(song as Song);
                    }
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:scale-105 text-sm shadow"
                >
                  {isPlaying && currentSong?.song_id === song.song_id ? (
                    <FiPauseCircle />
                  ) : (
                    <FiPlayCircle />
                  )}
                </button>

                {!isLikedPlaylist && (
                  <button
                    onClick={() => handleRemove(song.song_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm shadow"
                  >
                    ❌ Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && playlist && (
        <AddSongModal
          onClose={() => setShowModal(false)}
          onAdd={fetchPlaylist}
          playlistId={playlist.playlist_id}
        />
      )}
    </div>
  );
}
