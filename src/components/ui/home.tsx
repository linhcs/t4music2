"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useState, useEffect, useCallback, useRef } from "react";
import { Song } from "../../../types";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import PlayBar from "@/components/ui/playBar";

const ListenerHome = () => {
  const { username } = useUserStore();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //fetch songs/albums from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/songs');
        const data: Song[] = await response.json();
        setSongs(data);
      } catch(error) {
        console.error("Failed to fetch songs:", error);
      }
    };
    fetchData();
  }, []);

  //audio control
  const audioPlayer = useCallback((song: Song) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', updateProgress);
    }

    //play/pause same song
    if (currentSong?.song_id === song.song_id) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    //change to another song
    audioRef.current.pause();
    audioRef.current.src = song.file_path;
    audioRef.current.currentTime = 0;
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    audioRef.current.play().catch(error => console.error("Playback failed:", error));
  }, [currentSong]);

  //update progress bar
  const updateProgress = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);

  //allow user to click on playbar to adjust
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return;

    const ProgressBar = e.currentTarget;
    const clickPosition = e.clientX - ProgressBar.getBoundingClientRect().left;
    const progressBarWidth = ProgressBar.clientWidth;
    const seekPercentage = (clickPosition / progressBarWidth) * 100;
    const seekTime = (audioRef.current.duration * seekPercentage) / 100;

    audioRef.current.currentTime = seekTime;
    setProgress(seekPercentage);
  }, [currentSong]);

  //prevents from rendering over and over again
  const SongGallerySection = useCallback(({ title, items }: { title: string; items: Song[] }) => {
    return (
      <section className="w-full max-w-7xl">
        <h2 className="text-xl font-bold text-white mt-8 mb-3">{title}</h2>
        <div className="grid grid-cols-5 gap-4">
          {items.map((song) => {
            const album_art = song.album?.album_art || '';
            const isSongCurrentlyPlaying = currentSong?.song_id === song.song_id && isPlaying;

            return (
              <div
                key={song.song_id}
                className="group relative rounded-lg overflow-hidden shadow-md no-flicker"
                style={{
                  backgroundImage: `url(${album_art})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "60%",
                  paddingTop: "60%",
                  willChange: "transform, opacity"
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      audioPlayer(song);
                    }} 
                    className="text-5xl text-white transition-transform duration-100 hover:scale-105 ease-out will-change-transform"
                  >
                    {isSongCurrentlyPlaying ? <FiPauseCircle /> : <FiPlayCircle />}
                  </button>
                </div>
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 px-2 py-1">
                  <h3 className="text-white text-sm font-semibold truncate">{song.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }, [currentSong, isPlaying, audioPlayer]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} /> 
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role="listener" />
        <main className="p-6 overflow-auto">
          <SongGallerySection title="Continue Where You Left Off" items={songs.slice(0, 5)} />
          <SongGallerySection title="Recently Played Songs" items={songs.slice(0, 5)} />
          <SongGallerySection title="Recently Played Albums" items={songs.slice(0, 5)} />
          <SongGallerySection title="Recommended For You" items={songs.slice(0, 5)} />
        </main>
      </div>
      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && audioPlayer(currentSong)}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default ListenerHome;