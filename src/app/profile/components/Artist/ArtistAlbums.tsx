"use client";

export default function ArtistAlbums() {
  const artistAlbums = [
    { name: "Debut Album", img: "/album1.jpg" },
    { name: "Acoustic Sessions", img: "/album2.jpg" },
    { name: "Hits Collection", img: "/album3.jpg" },
  ];

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Albums I&apos;ve Created</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {artistAlbums.map((album, index) => (
          <div
            key={index}
            className="min-w-[180px] bg-gray-900 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={album.img}
              alt={album.name}
              className="h-40 w-full object-cover rounded-t-xl"
            />
            <p className="text-center py-3 font-semibold">{album.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
