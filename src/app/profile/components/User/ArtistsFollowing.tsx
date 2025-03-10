"use client";

export default function ArtistsFollowing() {
  const artists = [
    { name: "Artist 1", img: "/artist-default.jpg" },
    { name: "Artist 2", img: "/artist-default.jpg" },
    { name: "Artist 3", img: "/artist-default.jpg" },
  ];

  return (
    <div className="mt-10 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Artists You&apos;re Following</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {artists.map((artist, idx) => (
          <div
            key={idx}
            className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={artist.img}
              alt={artist.name}
              className="w-28 h-28 rounded-full shadow-xl object-cover"
            />
            <p className="mt-2 font-medium">{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
