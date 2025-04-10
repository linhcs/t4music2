"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getPlaybackURL } from "@/app/api/misc/actions";
import { useUserStore } from "@/store/useUserStore";
import { Song } from "@/types";

export function useAudioPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1); // Default volume is set to 100%
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update progress whenever the song is playing
  const updateProgress = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);

  // Add the event listener only once when the audioRef is set
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", updateProgress);
        }
      };
    }
  }, [updateProgress]);

  // Play or pause song
  const playSong = useCallback(async (song: Song) => {
    console.log("Setting current song:", song); // Debugging play issue/playbar issue

    setCurrentSong(song);  // Setting the song

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const urlResult = await getPlaybackURL(song.file_path);
    if ("failure" in urlResult) {
      console.error("Failed to get playback URL:", urlResult.failure);
      return;
    }

    if (currentSong?.song_id === song.song_id) {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Change song
    audioRef.current.src = urlResult.success.url;
    audioRef.current.currentTime = 0;
    setProgress(0);
    audioRef.current.volume = volume;  // Set the volume when the song starts

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio playback failed:", err);
      setIsPlaying(false);
    }

    // Update streaming history and top tracks
    await fetch("/api/streaming/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: useUserStore.getState().user_id,
        songId: song.song_id,
        artistId: song.user_id,
      }),
    });

    // Update user data after playing song
    const updatedRes = await fetch("/api/user/me", { cache: "no-store" });
    const updatedData = await updatedRes.json();
    const store = useUserStore.getState();
    store.setStreamingHistory(updatedData.streamingHistory);
    store.setTopTracks(updatedData.topTracks);
  }, [currentSong, volume]);

  // Handle seek bar change
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const bar = e.currentTarget;
    const percent = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  }, []);

  return {
    currentSong,
    isPlaying,
    progress,
    playSong,
    audioRef,
    handleSeek,
    volume,
    setVolume,
  };
}
