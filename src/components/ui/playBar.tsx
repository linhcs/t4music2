"use client";

import Image from 'next/image';
import { Song } from "../../../types";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";

//playBar "structure"
interface PlayBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function PlayBar({ currentSong, isPlaying, progress, onPlayPause, onSeek }: PlayBarProps) {
  const { likedSongs, toggleLike, username } = useUserStore();

  if (!currentSong) return null;

  const isLiked = likedSongs.some((s) => s.song_id === currentSong.song_id);

  const handleLike = async () => {
    toggleLike(currentSong);
    try {
      await fetch("/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, songId: currentSong.song_id }),
      });
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 border-t border-gray-700/50 p-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        
        {/* display album art in playbar */}
        {currentSong?.album?.album_art && (
          <Image
            src={currentSong.album.album_art}
            className="w-16 h-16 rounded-md"
            alt={currentSong.album.title}
            width={64}
            height={64}
                    unoptimized={true}
          />
        )}

        <div className="flex-1 min-w-0">
          {/* display song name and artist name */}
          <h3 className="text-white font-medium truncate">
            {currentSong?.title || "No song currently playing"}
          </h3>
          <p className="text-gray-400 text-sm truncate">
            {currentSong?.users?.username || "Unknown artist"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* display controls */}
          <button
            onClick={onPlayPause}
            className="text-3xl text-white"
          >
            {isPlaying ? <FiPauseCircle /> : <FiPlayCircle />}
          </button>

          {/* like button */}
          <button onClick={handleLike} className="text-xl hover:scale-110 transition-transform">
            {isLiked ? (
              <FaHeart className="text-pink-500" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-2 cursor-pointer" onClick={onSeek}>
        {/* progress bar */}
        <div className="h-1 bg-gray-700 rounded-full w-full">
          <div
            className="h-full bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 rounded-full transition-all duration-300 will-change-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
