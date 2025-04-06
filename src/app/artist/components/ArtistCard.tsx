import { useState } from "react";
import Image from "next/image";

export default function ArtistCard({ artist }: { artist: any }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="relative w-full h-80 overflow-hidden bg-black">
      <Image
        src="/artist-banner.jpg"
        alt="Artist Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        width={1920}
        height={1080}
        priority
      />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black" />

      <div className="relative z-10 flex items-end h-full px-8 pb-6">
        <div className="flex items-center gap-6">
          <Image
            src={artist?.pfp || "/artist-default.jpg"}
            alt={artist?.username || "Artist Avatar"}
            className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-xl"
            width={128}
            height={128}
          />
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-white">@{artist?.username}</h1>
            <p className="text-gray-300 mt-1">10,532,242 monthly listeners</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-400 text-sm">Pop • Songwriter</p>
              <button
                onClick={handleFollow}
                className="px-4 py-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full text-white font-semibold shadow hover:opacity-90 transition"
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
