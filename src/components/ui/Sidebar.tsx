"use client";
import { useUserStore } from "@/store/useUserStore";
import { FaPlusCircle } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {
  FaBars,
  FaHeart,
  // FaListUl,
  // FaMusic,
  FaChevronLeft,
  FaUpload,
} from "react-icons/fa";

export default function Sidebar() {
  const username = useUserStore((state) => state.username);
  const role = useUserStore((state) => state.role);
  const playlists = useUserStore((state) => state.playlists); // ✅ Add this
  const [isOpen, setIsOpen] = useState(true);
  const setShowPlaylistModal = useUserStore((state) => state.setShowPlaylistModal);

  return (
    <div
      className={`bg-black text-white h-full transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col`}
    >
      
      <div className="flex items-center justify-between p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <FaChevronLeft /> : <FaBars />}
        </button>

        {isOpen && (
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient drop-shadow-lg">
            Hi, {username || "Guest"}
          </h1>
        )}
      </div>

      <nav className="flex flex-col space-y-2 px-4">
        <Link href="/playlists/liked" className="flex items-center gap-3 hover:text-pink-400 transition-all duration-100 ease-in-out">
          <FaHeart />
          {isOpen && <span>Liked Songs</span>}
        </Link>
        {role === "artist" && (
          <Link href="/fileupload" className="flex items-center gap-3 hover:text-green-400 transition-all duration-100 ease-in-out">
            <FaUpload />
            {isOpen && <span>Upload Song</span>}
          </Link>
        )}
      </nav>

      {playlists?.length > 0 && (
  <div className="mt-6 px-4">
    {isOpen && (
      <h2 className="text-xs text-gray-400 uppercase mb-2">Your Playlists</h2>
    )}
    <ul className="space-y-3">
      {isOpen && (
  <button
    onClick={() => setShowPlaylistModal(true)}
    className="flex items-center gap-2 text-sm text-white hover:text-pink-400 transition mt-6 px-4"
  >
    <FaPlusCircle />
    Create Playlist
  </button>
)}
     {playlists
  .filter((p) => p.playlist_id !== "liked") 
  .slice(0, 10)
  .map((playlist) => (
        <li key={playlist.playlist_id}>
          
          <Link
          href={`/playlists/${playlist.playlist_id}`}

            className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg transition"
          >
            <Image
            src={
            playlist.playlist_art ||
            (playlist.playlist_id === "liked"
             ? "/likedsong/liked_song.jpg"
            : "/albumArt/defaultAlbumArt.png")
         }
           alt={playlist.name}
           width={40}
          height={40}
           className="object-cover rounded-md"
/>

            {isOpen && <span className="truncate text-sm">{playlist.name}</span>}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}    </div>
  );
}
