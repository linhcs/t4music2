"use client";

import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useState, useEffect, useCallback, useRef } from "react";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import PlayBar from "@/components/ui/playBar";
import { useRouter } from "next/navigation"; 
import { getPlaybackURL } from "@/app/api/misc/actions";
 import { Song } from "../../../types";

 const ListenerHome = () => {
  const router = useRouter()
  const { username, toggleLike, likedSongs, playlists } = useUserStore();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  //fetch songs from API
  
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    song: Song | null;
  } | null>(null);
  
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  
  //fetch songs/albums from API
  useEffect(() => {
    setHasMounted(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data: Song[] = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //update progress bar
  const updateProgress = useCallback(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  }, []);

  //audio control
  const audioPlayer = useCallback(
    async (song: Song) => {
      if (audioRef.current) {
        audioRef.current.pause(); // Stop previous song
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
  
      audioRef.current = new Audio();
      audioRef.current.addEventListener("timeupdate", updateProgress);
  
      // Play/pause same song
      if (currentSong?.song_id === song.song_id) {
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => setIsPlaying(true));
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        return;
      }
  
      // Get signed URL for playback
      const urlResult = await getPlaybackURL(song.file_path);
      if ("failure" in urlResult) {
        console.error("Failed to get playback URL:", urlResult.failure);
        return;
      }
  
      audioRef.current.src = urlResult.success.url;
      audioRef.current.currentTime = 0;
      setCurrentSong(song);
      setIsPlaying(true);
      setProgress(0);
  
      try {
        await audioRef.current.play();
  
        // Log streaming history AFTER playback starts
        await fetch("/api/streaming/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: useUserStore.getState().user_id,
            songId: song.song_id,
            artistId: song.user_id,
          }),
        });
      } catch (err) {
        console.error("Playback or stream logging failed:", err);
      }
    },
    [currentSong, updateProgress]
  );
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !currentSong) return;

      const ProgressBar = e.currentTarget;
      const clickPosition =
        e.clientX - ProgressBar.getBoundingClientRect().left;
      const progressBarWidth = ProgressBar.clientWidth;
      const seekPercentage = (clickPosition / progressBarWidth) * 100;
      const seekTime = (audioRef.current.duration * seekPercentage) / 100;

      audioRef.current.currentTime = seekTime;
      setProgress(seekPercentage);
    },
    [currentSong]
  );

  //prevents from rendering over and over again
  const SongGallerySection = useCallback(
    ({ title, items }: { title: string; items: Song[] }) => {
      return (
        <section className="w-full max-w-7xl">
          <h2 className="text-xl font-bold text-white mt-8 mb-3">{title}</h2>
          <div className="grid grid-cols-5 gap-4">
            {items.map((song) => {
              const album_art = song.album?.album_art || "";
              const isSongCurrentlyPlaying =
                currentSong?.song_id === song.song_id && isPlaying;

     {/*added this bc we need it in order to add prompt box thingy*/}
              return (
                <div
                  key={song.song_id}
                onContextMenu={(e) => {
                  e.preventDefault(); // this prevents opening randomly on page w/ right click
                  setContextMenu({ x: e.clientX, y: e.clientY, song }); // context menu purr
                }}
                onClick={() => audioPlayer(song)}
                  className="group relative rounded-lg overflow-hidden shadow-md no-flicker"
                  style={{
                    backgroundImage: `url(${album_art})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "60%",
                    paddingTop: "60%",
                    willChange: "transform, opacity",
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
                      {isSongCurrentlyPlaying ? (
                        <FiPauseCircle />
                      ) : (
                        <FiPlayCircle />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-50 px-2 py-1">
                    <h3 className="text-white text-sm font-semibold truncate">
                      {song.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    },
    [currentSong, isPlaying, audioPlayer]
  );

  if (!hasMounted) return null;



   if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="text-xl">Loading songs...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar username={username} />
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role="listener" />
        <main className="p-6 overflow-auto">
        <SongGallerySection
             title="Recently Added"
             items={songs.slice(0, 5)}
           />
           <SongGallerySection title="Popular Songs" items={songs.slice(0, 5)} />
           <SongGallerySection title="Your Library" items={songs.slice(0, 5)} />
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

      {contextMenu && (
        <div
          className="fixed bg-gray-800 text-white rounded shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu(null)}
        >
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={async () => {
                const song = contextMenu.song!;
                toggleLike(song); // updating zustand here 
              
                try {
                  await fetch("/api/likes/toggle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      username,
                      songId: song.song_id,
                    }),
                  });
                } catch (err) {
                  console.error("Failed to sync like to DB:", err);
                }
              
                setContextMenu(null);
              }}
              
            >
              💗 {likedSongs.some((s) => s.song_id === contextMenu.song?.song_id) ? 'Remove from your Liked Songs' : 'Save to your Liked Songs'}
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
                  fetch("/api/playlist/add", {
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
                router.push("/listener/my-playlists?create=true");
              }}
            >
              + Create New Playlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListenerHome;
