"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Album = {
  album_id: number;
  title: string;
  album_art?: string;
  user_id: number;
};

export default function ArtistAlbums() {
  const { user_id, isLoggedIn } = useUserStore();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      const res = await fetch(`/api/albums/user/${user_id}`);
      const data = await res.json();
      setAlbums(data);
    }

    if (isLoggedIn) fetchAlbums();
  }, [user_id, isLoggedIn]);

  const handleConfirmDelete = async () => {
    if (!albumToDelete) return;

    const res = await fetch(`/api/albums/${albumToDelete.album_id}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed to delete album");

    setAlbums((prev) => prev.filter((a) => a.album_id !== albumToDelete.album_id));
    setIsConfirmOpen(false);
    setAlbumToDelete(null);
    alert("🗑️ Album deleted!");
  };

  return (
    <div className="mt-10 w-full max-w-4xl">
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {albums.map((album) => (
          <div
          key={album.album_id}
          className="relative group min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center py-4"
        >
          {/* fixed to only show delete button if the album belongs to the logged in user */}
          {album.user_id === user_id && (
            <button
            onClick={() => {
              setAlbumToDelete(album);
              setIsConfirmOpen(true);
            }}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            title="Delete album"
          >
            <FaTrashAlt size={14} />
          </button>
        )}
    
        <Link href={`/albums/${album.album_id}`} className="flex flex-col items-center">
          <div className="h-36 w-36 bg-gray-800 rounded-xl overflow-hidden">
            <Image
              src={album.album_art || "/albumArt/defaultAlbumArt.png"}
              alt={album.title}
              width={144}
              height={144}
              className="rounded-xl object-cover"
            />
          </div>
          <p className="text-center py-3 font-semibold">{album.title}</p>
        </Link>
      </div>
    ))}

        {/* Add Album Card */}
        <Link href="/albums/create">
          <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-4">
            <div className="h-36 w-36 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FaPlus size={48} className="text-white" />
            </div>
            <p className="text-center py-3 font-semibold">Add Album</p>
          </div>
        </Link>
      </div>

      {/* 🧼 ConfirmModal */}
      {isConfirmOpen && albumToDelete && (
        <ConfirmModal
          title="Delete Album?"
          message={`Are you sure you want to delete "${albumToDelete.title}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsConfirmOpen(false);
            setAlbumToDelete(null);
          }}
        />
      )}
    </div>
  );
}
