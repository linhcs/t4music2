"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

interface Song {
  song_id: number;
  title: string;
  duration: number;
  file_path: string;
}

interface Album {
  album_id: number;
  title: string;
  album_art?: string;
  songs: Song[];
}

export default function AlbumPage() {
  const params = useParams();
  const album_id = Array.isArray(params.album_id) ? params.album_id[0] : params.album_id;
  const { user_id } = useUserStore();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [nowPlayingTitle, setNowPlayingTitle] = useState("");

  const [newSong, setNewSong] = useState({
    title: "",
    genre: "",
    duration: "",
    file_path: "",
    file_format: "",
  });

  const albumAudioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    const fetchAlbum = async () => {
      const res = await fetch(`/api/albums/${album_id}`);
      const data = await res.json();
      setAlbum(data);
      setLoading(false);
    };
    if (album_id) fetchAlbum();
  }, [album_id]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAddSong = async () => {
    const { title, genre, duration, file_path, file_format } = newSong;
    if (!title || !genre || !duration || !file_path || !file_format) {
      return alert("Please fill out all fields");
    }

    setSubmitting(true);
    const res = await fetch(`/api/albums/${album_id}/add-song`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSong, duration: parseInt(duration), user_id }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed to add song");

    alert("✅ Song added!");
    setAlbum((prev) => prev ? { ...prev, songs: [...prev.songs, data] } : null);
    setNewSong({ title: "", genre: "", duration: "", file_path: "", file_format: "" });
    setAudioPreviewUrl("");
    setShowModal(false);
    setSubmitting(false);
  };

  const handleDeleteSong = async (song_id: number) => {
    if (!confirm("Delete this song?")) return;
    const res = await fetch(`/api/songs/${song_id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return alert(data.error);
    setAlbum((prev) => prev ? { ...prev, songs: prev.songs.filter((s) => s.song_id !== song_id) } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      const seconds = Math.floor(audio.duration);
      setNewSong((prev) => ({
        ...prev,
        file_path: url,
        file_format: file.type.split("/")[1],
        duration: seconds.toString(),
      }));
      setAudioPreviewUrl(url);
    });
  };

  const playAlbum = () => {
    if (!album || album.songs.length === 0) return;
    const track = album.songs[0];
    albumAudioRef.current!.src = track.file_path;
    albumAudioRef.current!.play();
    setNowPlayingTitle(track.title);
    setCurrentTrackIndex(0);
  };

  const playSingle = (filePath: string, title: string) => {
    if (albumAudioRef.current) {
      albumAudioRef.current.src = filePath;
      albumAudioRef.current.play();
      setNowPlayingTitle(title);
    }
  };

  const handleTrackEnd = () => {
    if (!album) return;
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex < album.songs.length) {
      const track = album.songs[nextIndex];
      albumAudioRef.current!.src = track.file_path;
      albumAudioRef.current!.play();
      setNowPlayingTitle(track.title);
      setCurrentTrackIndex(nextIndex);
    }
  };

  if (loading) return <div className="text-white p-6">Loading album...</div>;
  if (!album) return <div className="text-red-500 p-6">Album not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8">
        <button onClick={() => window.history.back()} className="mb-6 text-gray-400 hover:text-white">
          ← Back
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          <Image
            src={album.album_art?.startsWith("http") ? album.album_art : `/${album.album_art}` || "/albumArt/defaultAlbumArt.png"}
            alt="Album Cover"
            width={200}
            height={200}
            className="object-cover rounded-md shadow-lg"
          />
          <div className="flex flex-col justify-end">
            <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={playAlbum}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
              >
                ▶ Play Album
              </button>
              {nowPlayingTitle && (
                <span className="text-sm text-gray-300 italic mt-1">
                  Now Playing: <span className="text-white font-semibold">{nowPlayingTitle}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-[auto_1fr_auto_auto] text-gray-400 px-4 py-2 border-b border-gray-700">
          <span className="justify-self-center">#</span>
          <span>Title</span>
          <span className="justify-self-end">Duration</span>
          <span></span>
        </div>

        {album.songs.map((track, i) => (
          <div
            key={track.song_id}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition"
          >
            <span className="text-gray-400">{i + 1}</span>
            <div className="flex items-center gap-3">
              {track.title}
              <button
                onClick={() => playSingle(track.file_path, track.title)}
                className="bg-gray-800 text-white text-sm px-4 py-1 rounded-full hover:bg-green-500 hover:text-black transition"
              >
                ▶ Play
              </button>
            </div>
            <span className="text-gray-400">{formatDuration(track.duration)}</span>
            <button
              onClick={() => handleDeleteSong(track.song_id)}
              className="ml-4 text-red-500 hover:text-red-700"
              title="Delete song"
            >
              🗑️
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          ➕ Add Song to Album
        </button>
      </div>

      {/* Player */}
      <audio ref={albumAudioRef} onEnded={handleTrackEnd} hidden />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Add a New Song</h3>
            <input
              type="text"
              placeholder="Song Title"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded text-white"
            />
            <input
              type="text"
              placeholder="Genre"
              value={newSong.genre}
              onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded text-white"
            />
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              onChange={handleFileChange}
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded text-white"
            />
            {audioPreviewUrl && (
              <audio controls src={audioPreviewUrl} className="w-full mb-4 rounded" />
            )}
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">
                Cancel
              </button>
              <button
                onClick={handleAddSong}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                {submitting ? "Adding..." : "Add Song"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
