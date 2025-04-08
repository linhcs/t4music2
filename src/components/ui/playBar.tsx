"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Song } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { FiPlayCircle, FiPauseCircle, FiSkipBack, FiSkipForward } from "react-icons/fi"; // Import cute icons for play and pause

interface PlayBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSkipNext?: () => void; //if it is a single song (will just restart song)
  onSkipPrevious?: () => void;
  isPlaylist?: boolean; //if its a playlist (can skip)
}

const PlayBar = ({ currentSong, isPlaying, progress, onPlayPause, onSeek, onSkipNext, onSkipPrevious, isPlaylist = false }: PlayBarProps) => {
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

  const handleSkipNext = () => {
    if (isPlaylist && onSkipNext) {
      onSkipNext();
    } else {
      onSeek({ currentTarget: { getBoundingClientRect: () => ({ left: 0 }), clientWidth: 100 } } as React.MouseEvent<HTMLDivElement>);
    }
  };

  const handleSkipPrevious = () => {
    if (isPlaylist && onSkipPrevious) {
      onSkipPrevious();
    } else {
      onSeek({ currentTarget: { getBoundingClientRect: () => ({ left: 0 }), clientWidth: 100 } } as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 border-t border-gray-700/50 p-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {currentSong?.album?.album_art && (
          <img
            src={currentSong.album.album_art}
            className="w-16 h-16 rounded-md"
            alt={currentSong.album.title}
            width={64}
            height={64}
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{currentSong?.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentSong?.users?.username || "Unknown artist"}</p>
        </div>

        <div className="flex items-center gap-4">
        <button 
            onClick={handleSkipPrevious}
            className="text-xl text-white hover:text-purple-400 transition-colors"
            aria-label="Previous track"
          >
            <FiSkipBack />
          </button>

          <button onClick={onPlayPause} className="text-3xl text-white">
            {isPlaying ? (
              <FiPauseCircle className="text-white" />
            ) : (
              <FiPlayCircle className="text-white" />
            )}
          </button>

          <button 
            onClick={handleSkipNext}
            className="text-xl text-white hover:text-purple-400 transition-colors"
            aria-label="Next track"
          >
            <FiSkipForward />
          </button>

          <button onClick={handleLike} className="text-xl hover:scale-110 transition-transform">
            {isLiked ? <FaHeart className="text-pink-500" /> : <FaRegHeart className="text-white" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-2 cursor-pointer" onClick={onSeek}>
        <div className="h-1 bg-gray-700 rounded-full w-full">
          <div
            className="h-full bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 rounded-full transition-all duration-300 will-change-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayBar;