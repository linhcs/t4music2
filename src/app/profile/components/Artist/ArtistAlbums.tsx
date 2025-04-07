"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaTrashAlt } from "react-icons/fa";


interface albumtype {
  album_id: number;
  album_art: string;    
  title: string;
}

export default function ArtistAlbums() {
  const { user_id, isLoggedIn } = useUserStore();
  const [albums, setAlbums] = useState<albumtype[]>([]);
  const [showModal, setShowModal] = useState(false); // optional for "add album" modal

  console.log(showModal, setShowModal);// getting rid of error may be delete

  useEffect(() => {
    async function fetchAlbums() {
      const res = await fetch(`/api/albums/user/${user_id}`);
      const data = await res.json();
      setAlbums(data);
    }

    if (isLoggedIn) fetchAlbums();
  }, [user_id, isLoggedIn]);

  const handleDelete = async (albumId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this album?");
    if (!confirm) return;

    const res = await fetch(`/api/albums/${albumId}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed to delete album");

    alert("🗑️ Album deleted!");
    setAlbums(albums.filter((a) => a.album_id !== albumId));
  };

  return (
    <div className="mt-10 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">My Albums</h3>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {albums.map((album) => (
          <div
            key={album.album_id}
            className="relative group min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center py-4"
          >
            <button
              onClick={() => handleDelete(album.album_id)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              title="Delete album"
            >
              <FaTrashAlt size={14} />
            </button>

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

        {/* ➕ Add Album Button */}
        <Link href="/albums/create">
          <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-4">
            <div className="h-36 w-36 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FaPlus size={48} className="text-white" />
            </div>
            <p className="text-center py-3 font-semibold">Add Album</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
