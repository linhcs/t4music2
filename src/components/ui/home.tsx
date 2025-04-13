"use client";

import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { Play, Pause } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { Song } from "../../../types";
import { useAudioPlayer } from "@/context/AudioContext";
import PlayBar from "@/components/ui/playBar";
import dynamic from "next/dynamic";
import cuteAnimation from "@/assets/cute_animation.json";
import YourLibrary from "@/components/ui/YourLibrary";
import CreatePlaylistModal from "@/app/profile/components/User/CreatePlaylistModal";
import Link from "next/link";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const formatArtistName = (username: string | undefined) => {
  if (!username) return 'Unknown Artist';
  return username.replace(/[_.-]/g, ' ');
};

const ListenerHome = () => {
  const { username, toggleLike, likedSongs, playlists } = useUserStore();
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; song: Song | null } | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user_id, setPlaylists } = useUserStore();
  
  type Album = {
    album_id: number;
    title: string;
    album_art: string;
    artist: string;
  };
  
  const [albums, setAlbums] = useState<Album[]>([]);
 
  const {
    currentSong,
    isPlaying,
    playSong,
    progress,
    handleSeek,
    togglePlayPause,
    volume,
    setVolume,
  } = useAudioPlayer();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    }
    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  useEffect(() => {
    setHasMounted(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/songs");
        const data: Song[] = await response.json();
        setSongs(data);
      } catch {
        console.error("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };
    const fetchPopularSongs = async () => {
      const res = await fetch("/api/songs/popular");
      const data = await res.json();
      setPopularSongs(data);
    };
    const fetchRecommendedSongs = async () => {
      const res = await fetch("/api/songs/recommended");
      const data = await res.json();
      setRecommendedSongs(data.songs);
    };
    
    const fetchAlbums = async () => {
      const res = await fetch("/api/albums"); // Fetch albums data
      const data = await res.json();
      setAlbums(data); // setting albums in the state
    };

    fetchData();
    fetchPopularSongs();
    fetchRecommendedSongs();
    fetchAlbums();  // added albums
  }, []);


  const SongGallerySection = ({ title, items }: { title: string; items: Song[] }) => (
    <section className="w-full max-w-7xl mx-auto relative">
      <h2 className="text-xl font-bold text-white mt-8 mb-4">{title}</h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide px-1 pb-2">
        {items.map((song) => {
          const isThisSong = currentSong?.song_id === song.song_id;
          const showPause = isThisSong && isPlaying;
          const album_art = song.album?.album_art || "";
          const artistName = formatArtistName(song.users?.username);

          return (
            <div
  key={song.song_id}
  onContextMenu={(e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, song });
  }}
  onClick={() => {
    // play/pause functionality on card click purr
    if (isThisSong) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  }}
  className="group relative rounded-xl overflow-hidden shadow-md w-[200px] h-[200px] cursor-pointer flex-shrink-0"
  style={{
    backgroundImage: `url(${album_art})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Larger invisible button area */}
  <div className="absolute inset-0 flex items-center justify-center">
    <button
      className="w-full h-full opacity-0 hover:opacity-100 flex items-center justify-center"
      aria-label={showPause ? "Pause" : "Play"}
    >
      {showPause ? (
        <Pause className="w-12 h-12 text-white" />
      ) : (
        <Play className="w-12 h-12 text-white" />
      )}
    </button>
  </div>

  <div className="absolute bottom-0 w-full bg-black bg-opacity-50 px-2 py-1">
    <h3 className="text-white text-sm font-semibold truncate">{song.title}</h3>
    <p className="text-gray-300 text-xs truncate">{artistName}</p>
  </div>
</div>
          );
        })}
      </div>
    </section>
  );

  const AlbumGallerySection = ({ title, albums }: { title: string; albums: Album[] }) => (
    <section className="w-full max-w-7xl mx-auto relative">
      <h2 className="text-xl font-bold text-white mt-8 mb-4">{title}</h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide px-1 pb-2">
        {albums.map((album) => (
          <Link key={album.album_id} href={`/albums/${album.album_id}`} passHref>
          <div
              className="group relative rounded-xl overflow-hidden shadow-md w-[200px] h-[200px] cursor-pointer flex-shrink-0"
              style={{
                backgroundImage: `url(${album.album_art || "/default_album_art.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  
              {/* Album title + artist */}
              <div className="absolute bottom-0 w-full bg-black bg-opacity-60 px-2 py-1">
                <h3 className="text-white text-sm font-semibold truncate">{album.title}</h3>
                <p className="text-gray-300 text-xs truncate">{album.artist}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
  
  if (!hasMounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-64 h-64">
          <Lottie animationData={cuteAnimation} loop={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar />
        <main className="p-6 overflow-auto">
          <SongGallerySection title="Recently Added" items={songs.slice(0, 15)} />
          <SongGallerySection title="Popular Songs" items={popularSongs.slice(0, 15)} />
          <SongGallerySection title="Recommended For You" items={recommendedSongs.slice(0, 15)} />
          <AlbumGallerySection title="Albums" albums={albums} />
          <section className="w-full max-w-7xl mx-auto relative">
            <YourLibrary />         </section>
        </main>
      </div>

      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-gray-800 text-white rounded shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={async () => {
                const song = contextMenu.song!;
                toggleLike(song);
                await fetch("/api/likes/toggle", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username, songId: song.song_id }),
                });
                setContextMenu(null);
              }}
            >
              💗 {likedSongs.some((s) => s.song_id === contextMenu.song?.song_id)
                ? "Remove from your Liked Songs"
                : "Save to your Liked Songs"}
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setSelectedSongForPlaylist(contextMenu.song);
                setShowPlaylistModal(true);
                setContextMenu(null);
              }}
            >
              ➕ Add to Playlist
            </li>
          </ul>
        </div>
      )}

      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-white text-lg font-bold">Add to Playlist</h2>
            {playlists.map((playlist) => (
              <div
                key={playlist.playlist_id}
                className="text-white hover:bg-gray-700 p-2 rounded cursor-pointer"
                onClick={() => {
                  fetch(`/api/playlists/${playlist.playlist_id}/add-song`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      song_id: selectedSongForPlaylist?.song_id,
                      playlist_id: playlist.playlist_id,
                    }),
                  }).then(() => setShowPlaylistModal(false));
                }}
              >
                {playlist.name}
              </div>
            ))}
            <button
              className="w-full mt-2 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded text-white font-medium"
              onClick={() => {
                setShowCreateModal(true);
                setShowPlaylistModal(false);
              }}
            >
              + Create New Playlist
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(name, playlist_art) => {
            fetch("/api/playlists/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id, name, playlist_art }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Failed to create playlist");
                return res.json();
              })
              .then((newPlaylist) => {
                const updated = [...playlists, newPlaylist];
                setPlaylists(updated);
              })
              .finally(() => setShowCreateModal(false))
              .catch((err) => console.error("Error creating playlist:", err));
          }}
        />
      )}

      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={() => currentSong && playSong(currentSong)}
        onSeek={handleSeek}
        volume={volume}
        setVolume={setVolume}
      />
    </div>
  );
};

export default ListenerHome;
