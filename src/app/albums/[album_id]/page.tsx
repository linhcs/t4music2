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
  const { username } = useUserStore();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newSong, setNewSong] = useState({ title: "", genre: "" });
  const albumAudioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingTitle, setNowPlayingTitle] = useState("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !newSong.title || !newSong.genre || !username || !album?.title) {
      alert("Please fill out all fields and select a file");
      return;
    }
  
    setSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("username", username);
      formData.append("title", newSong.title);
      formData.append("genre", newSong.genre);
      formData.append("albumName", album.title);
  
      const res = await fetch(`/api/albums/${album.album_id}/add-song`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
  
      // Add the new song to album state
      setAlbum((prev) =>
        prev ? { ...prev, songs: [...prev.songs, data.song] } : null
      );
  
      // Reset modal and form
      setShowModal(false);
      setNewSong({ title: "", genre: "" });
      setSelectedFile(null);
    } catch (error: any) {
      alert(error.message || "Failed to upload");
    } finally {
      setSubmitting(false); // ✅ Always reset submitting
    }
  };
  

  const handleRemove = async (song_id: number) => {
    if (!confirm("Delete this song?")) return;
    const res = await fetch(`/api/songs/${song_id}`, { method: "DELETE" });
    const result = await res.json();
    if (!res.ok) return alert(result.error || "Failed to delete");
    setAlbum((prev) => prev ? { ...prev, songs: prev.songs.filter((s) => s.song_id !== song_id) } : null);
  };

  const playSingle = (filePath: string, title: string) => {
    if (albumAudioRef.current) {
      albumAudioRef.current.src = filePath;
      albumAudioRef.current.play();
      setNowPlayingTitle(title);
    }
  };

  const playAlbum = () => {
    if (!album || album.songs.length === 0) return;
    const track = album.songs[0];
    playSingle(track.file_path, track.title);
    setCurrentTrackIndex(0);
  };

  const handleTrackEnd = () => {
    if (!album) return;
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex < album.songs.length) {
      const track = album.songs[nextIndex];
      playSingle(track.file_path, track.title);
      setCurrentTrackIndex(nextIndex);
    }
  };

  if (loading) return <div className="text-white p-6">Loading album...</div>;
  if (!album) return <div className="text-red-500 p-6">Album not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            className="grid grid-cols-[auto_1fr_auto_auto] items-center px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition rounded-lg mb-2"
          >
            <span className="text-gray-400">{i + 1}</span>
            <div className="flex items-center gap-3">
              <p className="font-medium text-white">{track.title}</p>
              <button
                onClick={() => playSingle(track.file_path, track.title)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:scale-105 text-sm shadow"
              >
                ▶ Play
              </button>
            </div>
            <span className="text-gray-400">{formatDuration(track.duration)}</span>
            <button
              onClick={() => handleRemove(track.song_id)}
              className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm shadow"
              title="Delete song"
            >
              ❌ Remove
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

      <audio
        ref={albumAudioRef}
        onEnded={handleTrackEnd}
        onTimeUpdate={() => setProgress(albumAudioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(albumAudioRef.current?.duration || 0)}
        hidden
      />

      {nowPlayingTitle && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-gray-700 backdrop-blur-md shadow-xl z-50 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold text-sm truncate max-w-xs">
              🎵 {nowPlayingTitle}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const audio = albumAudioRef.current;
                if (!audio) return;
                audio.paused ? audio.play() : audio.pause();
              }}
              className="bg-gray-700 hover:bg-green-500 hover:text-black px-4 py-1 rounded-full text-white font-bold transition"
            >
              ⏯️
            </button>
            <div className="w-48 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

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
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={submitting || !selectedFile || !newSong.title || !newSong.genre}
                className={`px-4 py-2 rounded text-white ${
                  submitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Uploading..." : "Upload Song"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
