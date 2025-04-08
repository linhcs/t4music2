"use client";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";

export default function TopArtists() {
  const { streamingHistory } = useUserStore();

  const artistMap = new Map<
    string,
    { count: number; pfp?: string; id?: number; name: string }
  >();

  for (const song of streamingHistory) {
    const artistName = song.users?.username || "Unknown";
    const artistId = song.userId || 0;
    const pfp = song.users?.pfp;

    if (!artistMap.has(artistId.toString())) {
      artistMap.set(artistId.toString(), {
        count: 1,
        pfp,
        id: artistId,
        name: artistName,
      });
    } else {
      artistMap.get(artistId.toString())!.count++;
    }
  }

  const topArtists = Array.from(artistMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  if (topArtists.length === 0) {
    return (
      <p className="text-gray-400 italic">
No top artists yet! Start listening to music! ✩°｡⋆⸜ 🎧✮      </p>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto scrollbar-hide">
      {topArtists.map(([,data]) => (
        <Link key={data.id} href={`/artist/${data.id}`}>
          <div className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 shadow-xl mx-auto">
              <Image
                src={data.pfp || "/artist-default.jpg"}
                alt={data.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 font-medium text-white">{data.name}</p>
            <p className="text-sm text-gray-400">{data.count} plays</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
