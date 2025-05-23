"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useUserStore } from "@/store/useUserStore";
import { useAudioPlayer } from "@/context/AudioContext"; // Use audio player hook
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi"; // Icons for play/pause
// import { types } from "util";
import { Song } from "@/types";

export default function LikedSongsPage() {
  const { likedSongs, username } = useUserStore(); // Get liked songs and username
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudioPlayer(); // Play song and manage play state

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <NavBar />

        <main className="p-6 overflow-auto">
          {/* Playlist Header */}
          <div className="bg-gradient-to-br from-pink-500 via-blue-400 to-purple-600 p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-4xl font-bold">Liked Songs</h1>
            <p className="mt-2 text-lg text-white/70">
              {username} • {likedSongs.length} songs
            </p>
          </div>

          {/* Liked Songs List */}
          <div className="p-6">
            <ul className="space-y-4">
              {likedSongs.map((song, index) => {
                const isCurrent = currentSong?.song_id === song.song_id; // Check if this song is currently playing

                return (
                  <li
                    key={song.song_id}
                    className={`flex items-center justify-between border-b border-gray-700 pb-2 ${isCurrent ? 'bg-white/10 rounded px-2' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 w-6 text-right">{index + 1}</span>
                      <div>
                        {/* Song Title */}
                        <p
                          className="font-semibold text-white cursor-pointer hover:underline"
                          onClick={() => playSong(song as Song)}
                        >
                          {song.title}
                        </p>
                        <p className="text-sm text-gray-400">{song.genre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => {
                          if (currentSong?.song_id === song.song_id) {
                            togglePlayPause(); // Toggle play/pause
                          } else {
                            playSong(song as Song); // Play this song
                          }
                        }}
                        className="text-lg text-white hover:text-gray-400"
                      >
                        {isPlaying && currentSong?.song_id === song.song_id ? (
                          <FiPauseCircle />
                        ) : (
                          <FiPlayCircle />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
