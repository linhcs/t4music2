"use client";

import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { Song } from "@/types";
import { getPlaybackURL } from "@/app/api/misc/actions";
import { useUserStore } from "@/store/useUserStore";

type AudioContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8); // Default volume
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const store = useUserStore();

  const updateProgress = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = useCallback(async (song: Song) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }

    const urlResult = await getPlaybackURL(song.file_path);
    if ("failure" in urlResult) {
      console.error("Failed to get playback URL:", urlResult.failure);
      return;
    }

    if (currentSong?.song_id === song.song_id) {
      togglePlayPause();
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = urlResult.success.url;
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setIsPlaying(true);
      setCurrentSong(song);
      setProgress(0);
    }

    await fetch("/api/streaming/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: store.user_id,
        songId: song.song_id,
        artistId: song.user_id,
      }),
    });

    const res = await fetch("/api/user/me", { cache: "no-store" });
    const updated = await res.json();
    store.setStreamingHistory(updated.streamingHistory);
    store.setTopTracks(updated.topTracks);
  }, [currentSong, store, volume]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return;
    const bar = e.currentTarget;
    const percent = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
    if (!isNaN(audioRef.current.duration)) {
      const newTime = percent * audioRef.current.duration;
      if (isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
        setProgress(percent * 100);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        playSong,
        togglePlayPause,
        audioRef,
        handleSeek,
        volume,
        setVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioPlayer must be used inside AudioProvider");
  return context;
};
