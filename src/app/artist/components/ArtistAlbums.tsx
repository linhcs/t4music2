"use client";

import Link from "next/link";
import Image from "next/image";
import { FiPlayCircle } from "react-icons/fi";
import { useAudioPlayer } from "@/context/AudioContext";
import type { Song } from "@/types";

interface Album {
  album_id: number;
  title: string;
  album_art?: string;
}

export default function ArtistAlbums({ albums }: { albums?: Album[] }) {
  const { playSong } = useAudioPlayer();

  if (!albums || albums.length === 0) {
    return <p className="text-gray-400">No albums available.</p>;
  }

  const handlePlayAlbum = async (albumId: number) => {
    try {
      const res = await fetch(`/api/albums/${albumId}`);
      const data = await res.json();
      const firstSong: Song | undefined = data?.songs?.[0];

      if (firstSong) {
        // 🔥 Attach full metadata like in TopTracks
        const songWithMeta: Song = {
          ...firstSong,
          users: { username: data.creator || "Unknown Artist" },
          album: {
            album_id: data.album_id,
            title: data.title,
            album_art: data.album_art || "/albumArt/defaultAlbumArt.png",
            user_id: data.user_id,
          },
        };

        playSong(songWithMeta); // 🔊 This will now trigger PlayBar correctly
      } else {
        alert("This album has no songs yet.");
      }
    } catch (error) {
      console.error("Failed to play album:", error);
    }
  };

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Albums by Artist</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {albums.map((album) => (
          <div key={album.album_id} className="relative group">
            <Link href={`/albums/${album.album_id}`}>
              <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Image
                  src={
                    album.album_art?.startsWith("http")
                      ? album.album_art
                      : album.album_art
                      ? `/${album.album_art}`
                      : "/albumArt/defaultAlbumArt.png"
                  }
                  alt={album.title}
                  width={180}
                  height={160}
                  className="h-40 w-full object-cover rounded-t-xl"
                />
                <p className="text-center py-3 font-semibold">{album.title}</p>
              </div>
            </Link>

            <button
              onClick={() => handlePlayAlbum(album.album_id)}
              className="absolute right-2 bottom-14 text-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
              aria-label="Play Album"
            >
              <FiPlayCircle />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
