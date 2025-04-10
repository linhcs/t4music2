"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AddSongModal from "@/app/profile/components/User/AddSongModal";
import Image from "next/image";
import { Song } from "@/types";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useAudioPlayer } from "@/context/AudioContext";
import { useUserStore } from "@/store/useUserStore";
import PlayBar from "@/components/ui/playBar";
import dynamic from "next/dynamic";
import cuteAnimation from "@/assets/cute_animation.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface Playlist {
  playlist_id: number;
  name: string;
  playlist_art?: string;
  playlist_songs: {
    songs: Song;
  }[];
}

const formatArtistName = (username: string | undefined) => {
  if (!username) return "Unknown Artist";
  return username.replace(/[_.-]/g, " ");
};

export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [songsToRender, setSongsToRender] = useState<Song[]>([]);

  const { currentSong, isPlaying, playSong, togglePlayPause, progress, volume, setVolume } = useAudioPlayer();
  const { likedSongs, username } = useUserStore();
  const isLikedPlaylist = id === "liked";
  const { handleSeek } = useAudioPlayer();

  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPlaylist = useCallback(async () => {
    const res = await fetch(`/api/playlists/${id}`);
    const data: Playlist = await res.json();
    setPlaylist(data);
    setSongsToRender(data.playlist_songs.map(entry => entry.songs));
  }, [id]);

  useEffect(() => {
    if (id && !isLikedPlaylist) {
      fetchPlaylist();
    } else if (isLikedPlaylist) {
      setSongsToRender(likedSongs as Song[]);
    }
  }, [id, isLikedPlaylist, fetchPlaylist, likedSongs]);

    useEffect(() => {
    if (currentSong) {
      const index = songsToRender.findIndex(s => s.song_id === currentSong.song_id);
      setCurrentSongIndex(index >= 0 ? index : null);
    } else {
      setCurrentSongIndex(null);
    }
  }, [currentSong, songsToRender]);

  const playNextSong = useCallback(() => {
    if (currentSongIndex === null || songsToRender.length === 0) return;
    
    const nextIndex = (currentSongIndex + 1) % songsToRender.length;
    playSong(songsToRender[nextIndex]);
  }, [currentSongIndex, songsToRender, playSong]);

  const playPreviousSong = useCallback(() => {
    if (currentSongIndex === null || songsToRender.length === 0) return;
    
    const prevIndex = (currentSongIndex - 1 + songsToRender.length) % songsToRender.length;
    playSong(songsToRender[prevIndex]);
  }, [currentSongIndex, songsToRender, playSong]);

  const handleRemove = async (songId: number) => {
    const res = await fetch(`/api/playlists/${id}/remove-song`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId }),
    });

    const result = await res.json();
    if (!res.ok) return alert(result.error || "Failed to remove song");
    alert("❌ Song removed");
    fetchPlaylist();
  };

  useEffect(() => {
    setHasMounted(true);
    if ((!isLikedPlaylist && playlist) || (isLikedPlaylist && songsToRender.length > 0)) {
      setLoading(false);
    }
  }, [playlist, isLikedPlaylist, songsToRender]);

  if (!hasMounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-64 h-64">
          <Lottie animationData={cuteAnimation} loop={true} />
        </div>
      </div>
    );
  }

  if (!isLikedPlaylist && !playlist) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
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

      <div className="flex gap-6 items-center">
        <Image
          src={
            isLikedPlaylist
              ? "/likedsong/liked_songs.jpg"
              : playlist?.playlist_art || "/artist-banner.jpg"
          }
          alt="Cover"
          width={160}
          height={160}
          className="w-40 h-40 object-cover rounded shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 text-transparent bg-clip-text">
            {isLikedPlaylist ? "💗 Liked Songs" : playlist?.name}
          </h1>
          <p className="text-gray-400 mt-2">
            {username} • {songsToRender.length} songs
          </p>

          {!isLikedPlaylist && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-black font-semibold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              + Add Song
            </button>
          )}
        </div>
      </div>

<div className="mt-10">
  {songsToRender.length === 0 ? (
    <p className="text-gray-500">No songs yet. Add some!</p>
  ) : (
    songsToRender.map((song, i) => (
      <div
        key={song.song_id}
        className="flex justify-between items-center py-4 px-4 border-b border-gray-700 bg-gray-900 rounded-lg mb-4 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 group"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-lg group-hover:text-white text-gray-300">
            {i + 1}. {song.title}
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-sm text-gray-500 group-hover:text-gray-400">
              {formatArtistName(song.users?.username)}
            </p>
            {song.genre && (
              <>
                <span className="text-gray-600">•</span>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">
                  {song.genre}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (currentSong?.song_id === song.song_id) {
                togglePlayPause();
              } else {
                playSong(song as Song);
              }
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:scale-105 text-sm shadow"
          >
            {isPlaying && currentSong?.song_id === song.song_id ? (
              <FiPauseCircle />
            ) : (
              <FiPlayCircle />
            )}
          </button>

          {!isLikedPlaylist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(song.song_id);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm shadow"
            >
              ❌ Remove
            </button>
          )}
        </div>
      </div>
    ))
  )}
</div>

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

      {showModal && playlist && (
        <AddSongModal
          onClose={() => setShowModal(false)}
          onAdd={fetchPlaylist}
          playlistId={playlist.playlist_id}
        />
      )}
    </div>
  );
}
