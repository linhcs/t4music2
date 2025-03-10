"use client";

export default function ArtistCard() {
  return (
    <div className="relative w-full bg-gradient-to-b from-gray-800 to-black">
      {/* Banner container - you could swap this out for a background image if you like */}
      <div className="h-48 flex items-end px-8 pb-6">
        {/* Avatar + Artist Info */}
        <div className="flex items-center gap-6">
          {/* Artist Avatar */}
          <img
            src="/artist-default.jpg"
            alt="Artist Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
          />

          {/* Text Info */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-white">Artist Name</h2>
            <p className="text-gray-300 text-sm">1.2M Followers • Indie Genre</p>
            <p className="text-gray-400 text-sm mt-1">
              Short tagline or bio snippet here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
