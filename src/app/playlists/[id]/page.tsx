"use client";

import { useEffect, useRef, useState, useCallback} from "react";
import { useParams, useRouter } from "next/navigation";
import AddSongModal from "@/app/profile/components/User/AddSongModal";
import Image from "next/image";
import PlayBar from "@/components/ui/playBar";
import { Song } from "@/types";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useAudioPlayer } from "@/context/AudioContext";

interface Playlist {
  playlist_id: number;
  name: string;
  playlist_art?: string;
  playlist_songs: {
    songs: Song;
  }[];
}

export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudioPlayer();

  const fetchPlaylist = useCallback(async () => {
    const res = await fetch(`/api/playlists/${id}`);
    const data: playlisttype = await res.json();
    setPlaylist(data);
  }, [id]);

  useEffect(() => {
    if (id) fetchPlaylist();
  }, [id]);

  const handleSkipNext = () => {
    if (!playlist?.playlist_songs || !currentSong) return;
    
    const currentIndex = playlist.playlist_songs.findIndex(
      (entry) => entry.songs.song_id === currentSong.song_id
    );
    
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % playlist.playlist_songs.length;
    const nextSong = playlist.playlist_songs[nextIndex]?.songs;
    if (nextSong) playSong(nextSong);
  };

  const handleSkipPrevious = () => {
    if (!playlist?.playlist_songs || !currentSong) return;
    
    const currentIndex = playlist.playlist_songs.findIndex(
      (entry) => entry.songs.song_id === currentSong.song_id
    );
    
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + playlist.playlist_songs.length) % playlist.playlist_songs.length;
    const prevSong = playlist.playlist_songs[prevIndex]?.songs;
    if (prevSong) playSong(prevSong);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return;
    
    const bar = e.currentTarget;
    const percent = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
    
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      const newTime = percent * audioRef.current.duration;
      if (isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
        setProgress(percent * 100);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(pct) ? 0 : pct);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentSong]);

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

  if (!playlist) return <div className="text-white p-10">Loading...</div>;

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
          src={playlist.playlist_art || "/artist-banner.jpg"}
          alt="Cover"
          width={160}
          height={160}
          className="w-40 h-40 object-cover rounded shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 text-transparent bg-clip-text">
            {playlist.name}
          </h1>
          <p className="text-gray-400 mt-2">{playlist.playlist_songs.length} songs</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-black font-semibold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            + Add Song
          </button>
        </div>
      </div>

      <div className="mt-10">
        {playlist.playlist_songs.length === 0 ? (
          <p className="text-gray-500">No songs yet. Add some!</p>
        ) : (
          playlist.playlist_songs.map((entry, i) => {
            const song = entry.songs;
            return (
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
                    onClick={() => {
                      if (currentSong?.song_id === song.song_id) {
                        togglePlayPause(); //play pause same song
                      } else {
                        playSong(song); //play new song
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
                  <button
                    onClick={() => handleRemove(song.song_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm shadow"
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && playlist && (
        <AddSongModal
          onClose={() => setShowModal(false)}
          onAdd={fetchPlaylist}
          playlistId={playlist.playlist_id}
        />
      )}

      {currentSong && (
        <>
          <audio
            ref={audioRef}
            src={`/${currentSong.file_path}`}
            autoPlay
            onEnded={() => togglePlayPause()}
          />
          <PlayBar
            currentSong={currentSong}
            isPlaying={isPlaying}
            progress={progress}
            onPlayPause={() => {
              if (isPlaying) {
                audioRef.current?.pause();
                togglePlayPause(); //pause
              } else {
                audioRef.current?.play().catch((error) => {
                  console.error("Error playing audio:", error);
                });
                togglePlayPause(); //play
              }
            }}
            onSeek={handleSeek}
            onSkipNext={handleSkipNext}
            onSkipPrevious={handleSkipPrevious}
          />
        </>
      )}
    </div>
  );
}
