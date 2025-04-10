"use client";

import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import { useRef } from "react";

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

  return (
    <section className="w-full">
      <h2 className="text-lg font-bold text-white mt-8 mb-3">Your Library</h2>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-1 pb-2"
      >
        {uniquePlaylists.map((item) => (
          <Link
            key={item.playlist_id}
            href={
              item.playlist_id === "liked"
                ? "/playlists/liked"
                : `/playlists/${item.playlist_id}`
            }
            className="min-w-[150px] max-w-[150px] h-[150px] shrink-0 group relative rounded-lg overflow-hidden shadow-md cursor-pointer"
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${
                  item.playlist_art?.trim()
                    ? item.playlist_art
                    : item.playlist_id === "liked"
                    ? "/likedsong/liked_songs.jpg"
                    : "/albumArt/defaultAlbumArt.png"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute bottom-0 w-full bg-black bg-opacity-60 px-2 py-1">
              <h3 className="text-white text-xs font-semibold truncate">
                {item.name}
              </h3>
              {item.playlist_id === "liked" && (
                <p className="text-gray-300 text-[10px] truncate">
                  {likedSongs.length} songs
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
