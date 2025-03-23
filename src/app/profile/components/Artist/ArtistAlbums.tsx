"use client";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function ArtistAlbums() {
  // Static album data for now; in the future, replace with dynamic backend data.
  const artistAlbums = [
    { id: "debut-album", name: "Debut Album", img: "/artist-placeholder.jpg" },
    { id: "summer-jams", name: "Summer Jams", img: "/artist-placeholder.jpg" },
    { id: "new-horizons", name: "New Horizons", img: "/artist-placeholder.jpg" },
  ];

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Albums by Artist</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {artistAlbums.map((album) => (
          // TODO: Update the URL pattern when integrating the backend.
          <Link key={album.id} href={`/albums/${album.id}`}>
            <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src={album.img}
                alt={album.name}
                className="h-40 w-full object-cover rounded-t-xl"
              />
              <p className="text-center py-3 font-semibold">{album.name}</p>
            </div>
          </Link>
        ))}
        {/* Plus card for adding a new album */}
        <Link href="/albums/create">
          <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="h-40 w-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 rounded-t-xl shadow-inner">
              <FaPlus size={48} className="text-white" />
            </div>
            <p className="text-center py-3 font-semibold">Add Album</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
