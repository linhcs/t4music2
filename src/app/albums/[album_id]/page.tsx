"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useAudioPlayer } from "@/context/AudioContext";
import PlayBar from "@/components/ui/playBar";

interface Song {
  song_id: number;
  title: string;
  duration: number;
  file_path: string;
  file_format: string; 
  user_id: number;    
  genre?: string;
}


interface Album {
  album_id: number;
  title: string;
  album_art?: string;
  user_id: number;
  creator: string;
  songs: Song[];
}

export default function AlbumPage() {
  const router = useRouter();
  const params = useParams();
  const album_id = Array.isArray(params.album_id) ? params.album_id[0] : params.album_id;
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    progress,
    handleSeek,
    volume,
    setVolume,
  } = useAudioPlayer();

  const [album, setAlbum] = useState<Album | null>(null);
  const [songsToRender, setSongsToRender] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      const res = await fetch(`/api/albums/${album_id}`);
      const data: Album = await res.json();
      setAlbum(data);
      setSongsToRender(data.songs);
    };
    if (album_id) fetchAlbum();
  }, [album_id]);

  useEffect(() => {
    if (currentSong) {
      const index = songsToRender.findIndex((s) => s.song_id === currentSong.song_id);
      setCurrentSongIndex(index >= 0 ? index : null);
    } else {
      setCurrentSongIndex(null);
    }
  }, [currentSong, songsToRender]);

  const playNextSong = useCallback(() => {
    if (currentSongIndex === null || songsToRender.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % songsToRender.length;
    playSongWithMeta(songsToRender[nextIndex]);
  }, [currentSongIndex, songsToRender]);

  const playPreviousSong = useCallback(() => {
    if (currentSongIndex === null || songsToRender.length === 0) return;
    const prevIndex = (currentSongIndex - 1 + songsToRender.length) % songsToRender.length;
    playSongWithMeta(songsToRender[prevIndex]);
  }, [currentSongIndex, songsToRender]);

  const playSongWithMeta = (track: Song) => {
    if (!album) return;
    playSong({
      ...track,
      users: { username: album.creator },
      album: {
        album_id: album.album_id,
        title: album.title,
        album_art: album.album_art || "/albumArt/defaultAlbumArt.png",
        user_id: album.user_id,
      },
    });
  };
  

  if (!album) return <div className="text-white p-6">Loading album...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-32 p-6">
      {/* ⬅️ Back Button */}
      <button
        onClick={() => router.push("/profile/user")}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Profile
      </button>

      {/* 🎵 Album Details */}
      <div className="flex gap-6 items-center">
        <Image
          src={
            album.album_art?.startsWith("http")
              ? album.album_art
              : `/${album.album_art}` || "/albumArt/defaultAlbumArt.png"
          }
          alt="Album Art"
          width={160}
          height={160}
          className="w-40 h-40 object-cover rounded shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 text-transparent bg-clip-text">
            {album.title}
          </h1>
          <p className="text-gray-400 mt-2">{album.creator} • {songsToRender.length} songs</p>
        </div>
      </div>

      {/* 🎶 Song List */}
      <div className="mt-10">
        {songsToRender.length === 0 ? (
          <p className="text-gray-500">No songs in this album yet.</p>
        ) : (
          songsToRender.map((song, i) => (
            <div
              key={song.song_id}
              className="flex justify-between items-center py-4 px-4 border-b border-gray-700 bg-gray-900 rounded-lg mb-4 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 group"
            >
              <div>
                <p className="font-semibold text-lg group-hover:text-white text-gray-300">
                  {i + 1}. {song.title}
                </p>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">{song.genre}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    currentSong?.song_id === song.song_id
                      ? togglePlayPause()
                      : playSongWithMeta(song)
                  }
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:scale-105 text-sm shadow"
                >
                  {isPlaying && currentSong?.song_id === song.song_id ? (
                    <FiPauseCircle />
                  ) : (
                    <FiPlayCircle />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔊 PlayBar */}
      {currentSong && (
        <PlayBar
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={togglePlayPause}
          onSeek={handleSeek}
          onSkipNext={playNextSong}
          onSkipPrevious={playPreviousSong}
          isPlaylist={true}
          volume={volume}
          setVolume={setVolume}
        />
      )}
    </div>
  );
}
