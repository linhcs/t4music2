"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Song } from "@/types";
import { useAudioPlayer } from "@/context/AudioContext";
import { Play, Pause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function ArtistSongs() {
  const { user_id } = useUserStore();
  const [songs, setSongs] = useState<Song[]>([]);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useAudioPlayer();

  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await fetch(`/api/songs/artist/${user_id}`);
        const data = await res.json();
        setSongs(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    }

    if (user_id) fetchSongs();
  }, [user_id]);

  return (
    <div className="flex gap-6 overflow-x-auto scrollbar-hide">
      {songs.map((song) => {
        const isCurrent = currentSong?.song_id === song.song_id;
        const albumArt = song.album?.album_art || "/albumArt/defaultAlbumArt.png";

        return (
          <div
            key={song.song_id}
            className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center py-4"
          >
            <div className="relative h-36 w-36 rounded-xl overflow-hidden mb-4">
              <Image
                src={albumArt}
                alt={song.title}
                fill
                className="object-cover rounded-xl"
              />
              <button
                onClick={() => (isCurrent ? togglePlayPause() : playSong(song))}
                className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 p-2 rounded-full z-10 transition-all"
                title={isCurrent && isPlaying ? "Pause" : "Play"}
              >
                {isCurrent && isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
            <p className="text-center font-semibold truncate">{song.title}</p>
            <p className="text-center text-sm text-gray-400">{song.genre}</p>
          </div>
        );
      })}

      {/* ➕ Upload Song card */}
      <Link
        href="/fileupload"
        className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-4"
      >
        <div className="h-36 w-36 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
          <FaPlus size={48} className="text-white" />
        </div>
        <p className="text-center py-3 font-semibold">Upload Song</p>
      </Link>
    </div>
  );
}
