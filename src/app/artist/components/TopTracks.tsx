"use client";

import Image from "next/image";
import { useAudioPlayer } from "@/context/AudioContext";
import type { Song } from "@/types";

export default function TopTracks({ tracks }: { tracks?: Song[] }) {
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudioPlayer();

  if (!tracks || tracks.length === 0) {
    return <p className="text-gray-400 mt-10">No tracks available.</p>;
  }

  const handlePlay = (track: Song) => {
    const isCurrent = currentSong?.song_id === track.song_id;
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(track);
    }
  };

  return (
    <div className="mt-12 w-full max-w-3xl">
      <h3 className="text-3xl font-semibold mb-5">Top Tracks</h3>
      <ul className="space-y-4">
        {tracks.map((track) => (
          <li
            key={track.song_id}
            className="bg-gray-900 py-3 px-5 rounded-xl shadow-lg flex items-center justify-between hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-4">
              <Image
                src={track.album?.album_art || "/albumArt/defaultAlbumArt.png"}
                className="object-cover rounded-md"
                width={48}
                height={48}
                alt={`${track.title} album art`}
                unoptimized
              />
              <div className="flex flex-col">
                <span className="font-medium text-lg text-white">{track.title}</span>
                <span className="text-gray-400 text-sm">
                  {track.users?.username || "Unknown Artist"}
                </span>
              </div>
            </div>

            <button
              onClick={() => handlePlay(track)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
            >
              {currentSong?.song_id === track.song_id && isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
