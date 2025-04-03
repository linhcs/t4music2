"use client";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";

export default function TopTracks() {
  const { streamingHistory } = useUserStore();

  const trackMap = new Map<number, {
    title: string;
    count: number;
    albumArt?: string;
    artist?: string;
  }>();

  for (const song of streamingHistory) {
    if (!trackMap.has(song.song_id)) {
      trackMap.set(song.song_id, {
        title: song.title,
        count: 1,
        albumArt: song.album?.album_art,
        artist: song.users?.username,
      });
    } else {
      trackMap.get(song.song_id)!.count++;
    }
  }

  const topTracks = Array.from(trackMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  if (topTracks.length === 0) {
    return (
      <p className="text-gray-400 italic">
        No top tracks yet! Start listening to music! ✩°｡⋆⸜ 🎧✮
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {topTracks.map(([id, data], i) => (
        <li
          key={id}
          className="flex justify-between items-center bg-gray-900 rounded-lg px-4 py-3 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-700">
              <Image
                src={data.albumArt || "/default-art.jpg"}
                alt={data.title}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-white font-semibold">{data.title}</h4>
              <p className="text-gray-400 text-sm">{data.artist || "Unknown artist"}</p>
            </div>
          </div>
          <span className="text-gray-400">#{i + 1}</span>
        </li>
      ))}
    </ul>
  );
}
