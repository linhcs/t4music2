"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
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
  setOnSongEnd: (callback: () => void) => void;
  lyrics: string | null;
  lyricsLoading: boolean;
  showLyrics: boolean;
  toggleLyrics: () => void;
  playNextSong: () => void; // Added for playlist functionality
  playPreviousSong: () => void; // Added for playlist functionality
  queue: Song[]; // Added for playlist functionality
  setQueue: (songs: Song[]) => void; // Added for playlist functionality
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]); // Store the playlist queue

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const store = useUserStore();

  const onSongEndRef = useRef<() => void>(() => {});

  const setOnSongEnd = useCallback((callback: () => void) => {
    onSongEndRef.current = callback;
  }, []);

  const toggleLyrics = useCallback(() => {
    setShowLyrics((prev) => !prev);
  }, []);

  const fetchLyrics = useCallback(async (song: Song) => {
    if (!song?.title || !song.users?.username) return;

    setLyricsLoading(true);
    try {
      const artist = song.users.username;
      const title = song.title;
      const response = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(
          artist
        )}/${encodeURIComponent(title)}`
      );

      if (response.ok) {
        const data = await response.json();
        setLyrics(data.lyrics);
      } else {
        setLyrics("Lyrics Not available for this song");
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics("Lyrics Not available for this song");
    } finally {
      setLyricsLoading(false);
    }
  }, []);

  const updateProgress = () => {
    if (
      audioRef.current &&
      !isNaN(audioRef.current.duration) &&
      isFinite(audioRef.current.duration)
    ) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSongEnd = useCallback(() => {
    playNextSong();
    onSongEndRef.current?.();
  }, [queue, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', handleSongEnd);
    return () => {
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [handleSongEnd]);

  const playNextSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(song => song.song_id === currentSong.song_id);
    if (currentIndex === -1 || currentIndex >= queue.length - 1) return;

    const nextSong = queue[currentIndex + 1];
    playSong(nextSong);
  }, [currentSong, queue]);

  const playPreviousSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(song => song.song_id === currentSong.song_id);
    if (currentIndex <= 0) return;

    const prevSong = queue[currentIndex - 1];
    playSong(prevSong);
  }, [currentSong, queue]);

  const playSong = useCallback(
    async (song: Song) => {
      const isSameSong = currentSong?.song_id === song.song_id;
  
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
  
      const audio = audioRef.current;
  
      if (isSameSong) {
        if (audio.paused) {
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (err) {
            console.error("Playback error:", err);
            setIsPlaying(false);
          }
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }
  
      try {
        audio.pause();
        audio.removeEventListener("timeupdate", updateProgress);
        audio.addEventListener("timeupdate", updateProgress);
  
        const urlResult = await getPlaybackURL(song.file_path);
        if ("failure" in urlResult) {
          console.error("Failed to get playback URL:", urlResult.failure);
          return;
        }
  
        audio.src = urlResult.success.url;
        audio.load();
        await new Promise((resolve) => {
          audio.onloadedmetadata = () => resolve(null);
        });
        audio.currentTime = 0;
        audio.volume = volume;
        await audio.play();
  
        setCurrentSong(song);
        setIsPlaying(true);
        setProgress(0);
  
        fetchLyrics(song);
  
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
      } catch (err) {
        console.error("Playback error:", err);
        setIsPlaying(false);
      }
    },
    [currentSong, store, volume, fetchLyrics, updateProgress]
  );
  


  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return;
    const bar = e.currentTarget;
    const percent =
      (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
    if (!isNaN(audioRef.current.duration)) {
      const newTime = percent * audioRef.current.duration;
      if (isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
        setProgress(percent * 100);
      }
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
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
        setOnSongEnd,
        lyrics,
        lyricsLoading,
        showLyrics,
        toggleLyrics,
        playNextSong,
        playPreviousSong,
        queue,
        setQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error("useAudioPlayer must be used inside AudioProvider");
  return context;
};