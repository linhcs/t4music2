"use client";

import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function YourLibrary() {
  const { playlists, likedSongs } = useUserStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const likedPlaylist = {
    playlist_id: "liked",
    name: "💗 Liked Songs",
    playlist_art: "/likedsong/liked_songs.jpg",
    isLiked: true,
    songs: likedSongs,
  };

  const hasLiked = playlists.some((p) => p.playlist_id === "liked");
  const fullLibrary = hasLiked ? playlists : [likedPlaylist, ...playlists];

  const uniquePlaylists = fullLibrary.filter(
    (item, index, self) =>
      index === self.findIndex((p) => p.playlist_id === item.playlist_id)
  );

  if (uniquePlaylists.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full relative">
      <h2 className="text-xl font-bold text-white mt-8 mb-3">Your Library</h2>

      {/* arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 rounded-full"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 rounded-full"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-1 pb-2"
      >
        {uniquePlaylists.map((item) => (
          <Link
            key={item.playlist_id}
            href={
              item.playlist_id === "liked"
                ? "/playlists/liked"
                : `/playlists/${item.playlist_id}`
            }
            className="w-[190px] aspect-square shrink-0"
            >
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-105 transition">
              <Image
                src={
                  item.playlist_art?.trim()
                    ? item.playlist_art
                    : item.playlist_id === "liked"
                    ? "/likedsong/liked_songs.jpg"
                    : "/albumArt/defaultAlbumArt.png"
                }
                alt={item.name}
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{item.name}</h3>
                {item.playlist_id === "liked" && (
                  <p className="text-sm text-white/60">
                    {likedSongs.length} songs
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
