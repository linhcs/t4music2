"use client";

import { useUserStore } from "@/store/useUserStore";
import { Song } from "@/types";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  FiPlayCircle,
  FiPauseCircle,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";
import { PiShuffleFill } from "react-icons/pi";

interface PlayBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  isPlaylist?: boolean;
  volume: number;
  setVolume: (v: number) => void;
  isShuffled?: boolean;
  setIsShuffled?: React.Dispatch<React.SetStateAction<boolean>>;
  shuffleSongs?: () => void;
}

const formatArtistName = (username: string | undefined) => {
  if (!username) return "Unknown Artist";
  return username.replace(/[_.-]/g, " ");
};

const PlayBar = ({
  currentSong,
  isPlaying,
  progress,
  onPlayPause,
  onSeek,
  onSkipNext,
  onSkipPrevious,
  isPlaylist = false,
  volume,
  setVolume,
  isShuffled,
  setIsShuffled,
  shuffleSongs,
}: PlayBarProps) => {
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
      const endSong = {
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, width: 100 }),
          clientWidth: 100,
        },
        clientX: 100,
      } as unknown as React.MouseEvent<HTMLDivElement>;
      onSeek(endSong);
      if (isPlaying) {
        setTimeout(() => onPlayPause(), 10);
      }
    }
  };

  const handleSkipPrevious = () => {
    if (isPlaylist && onSkipPrevious) {
      onSkipPrevious();
    } else {
      const restartSong = {
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, width: 100 }),
          clientWidth: 100,
        },
        clientX: 0,
      } as unknown as React.MouseEvent<HTMLDivElement>;
      onSeek(restartSong);
      setTimeout(() => {
        if (!isPlaying) {
          onPlayPause();
        }
      }, 10);
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
          <h3 className="text-white font-medium truncate">
            {currentSong?.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">
            {formatArtistName(currentSong?.users?.username)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* only render for playlist pages or album pages */}
          {isShuffled !== undefined && setIsShuffled && shuffleSongs && (
            <button
              onClick={() => {
                setIsShuffled((prev) => !prev);
                if (!isShuffled) shuffleSongs();
              }}
              className={`text-xl transition-colors ${
                isShuffled ? "text-sky-400" : "text-white"
              } hover:text-sky-600`}
              aria-label="Shuffle"
            >
              <PiShuffleFill />
            </button>
          )}

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

          <button
            onClick={handleLike}
            className="text-xl hover:scale-110 transition-transform"
          >
            {isLiked ? (
              <FaHeart className="text-pink-500" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </button>

          {/* 🔊 Volume Slider */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs text-gray-400">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-2 bg-gray-600 rounded-full cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto mt-2 cursor-pointer"
        onClick={onSeek}
      >
        <div className="h-1 bg-gray-700 rounded-full w-full">
          <div
            className="h-full bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayBar;
