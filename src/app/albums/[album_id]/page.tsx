"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useUserStore, usePlayerStore } from "@/store/useUserStore";

interface Song {
  song_id: number;
  title: string;
  duration: number;
  file_path: string;
}

interface Album {
  album_id: string;
  title: string;
  album_art?: string;
  user_id: number;
  creator: string;
  songs: Song[];
}

export default function AlbumPage() {
  const params = useParams();
  const album_id = Array.isArray(params.album_id) ? params.album_id[0] : params.album_id;
  const { username, user_id: loggedInUserId } = useUserStore();
  const { setSong } = usePlayerStore();

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newSong, setNewSong] = useState({ title: "", genre: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAlbum = async () => {
      const res = await fetch(`/api/albums/${album_id}`);
      const data = await res.json();
      setAlbum(data);
      setLoading(false);
    };
    if (album_id) fetchAlbum();
  }, [album_id]);

  const handleUpload = async () => {
    if (!selectedFile || !newSong.title || !newSong.genre || !username || !album?.title) {
      return alert("Fill all fields + select a file");
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
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setAlbum((prev) => prev ? { ...prev, songs: [...prev.songs, data.song] } : null);
      setShowModal(false);
      setNewSong({ title: "", genre: "" });
      setSelectedFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Upload failed");
      } else {
        alert("Upload failed");
      }
    }
     finally {
      setSubmitting(false);
    }
  };

  const playSong = (track: Song) => {
    setSong({
      ...track,
      users: { username: album?.creator || "Unknown" },
      album: {
        title: album?.title || "",
        album_art: album?.album_art || "/albumArt/defaultAlbumArt.png",
      },
    });
  };

  if (loading) return <div className="text-white p-6">Loading album...</div>;
  if (!album) return <div className="text-red-500 p-6">Album not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
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
            <p className="text-gray-400">Artist: {album.creator}</p>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-6xl mx-auto">
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
                onClick={() => playSong(track)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:scale-105 text-sm shadow"
              >
                ▶ Play
              </button>
            </div>
            <span className="text-gray-400">
              {`${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}`}
            </span>
            {loggedInUserId === album.user_id && (
              <button
                onClick={async () => {
                  const res = await fetch(`/api/songs/${track.song_id}`, { method: "DELETE" });
                  const result = await res.json();
                  if (!res.ok) return alert(result.error);
                  setAlbum((prev) =>
                    prev ? { ...prev, songs: prev.songs.filter((s) => s.song_id !== track.song_id) } : null
                  );
                }}
                className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm shadow"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}

        {loggedInUserId === album.user_id && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            ➕ Add Song to Album
          </button>
        )}
      </div>

      {/* Upload Modal */}
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
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded text-white"
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={submitting}
                className={`px-4 py-2 rounded text-white ${
                  submitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
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
