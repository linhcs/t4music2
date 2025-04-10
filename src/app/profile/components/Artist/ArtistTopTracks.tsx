"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Song } from "@/types";
import Image from "next/image";
import { useAudioPlayer } from "@/context/AudioContext";

export default function ArtistTopTracks() {
  const { user_id, isLoggedIn } = useUserStore();
  const [songs, setSongs] = useState<Song[]>([]);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useAudioPlayer(); // ⬅️ Add audio context
console.log(isPlaying);
  useEffect(() => {
    async function fetchTopSongs() {
      try {
        const res = await fetch(`/api/songs/artist/${user_id}`);
        const data = await res.json();
        setSongs(data || []);
      } catch (error) {
        console.error("Failed to fetch artist top tracks:", error);
      }
    }

    if (user_id) fetchTopSongs();
  }, [user_id]);

  const handleDelete = async (song_id: number) => {
    const confirmDelete = confirm("Delete this song?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/songs/${song_id}`, { method: "DELETE" });
    const result = await res.json();

    if (!res.ok) return alert(result.error);
    setSongs((prev) => prev.filter((s) => s.song_id !== song_id));
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {songs.map((song) => {
        const isCurrent = currentSong?.song_id === song.song_id;

        return (
          <div
            key={song.song_id}
            className="bg-gray-900 p-4 rounded-lg flex justify-between items-center hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-4">
              <Image
                src={song.album?.album_art || "/albumArt/defaultAlbumArt.png"}
                alt={song.title}
                width={48}
                height={48}
                className="object-cover rounded-md"
              />
              <div>
                <p
                  className="text-white font-semibold cursor-pointer hover:underline"
                  onClick={() =>
                    isCurrent ? togglePlayPause() : playSong(song)
                  }
                >
                  {song.title}
                </p>
                <p className="text-gray-400 text-sm">{song.plays_count} plays</p>
              </div>
            </div>

            {isLoggedIn && (
              <button
                onClick={() => handleDelete(song.song_id)}
                className="px-3 py-1 rounded text-white"
              >
                ❌
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
