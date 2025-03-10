"use client";
export default function LikedSongs() {
  const songs = [
    { title: "Sunset Lover", artist: "Petit Biscuit" },
    { title: "Levitating", artist: "Dua Lipa" },
    { title: "Blinding Lights", artist: "The Weeknd" },
  ];

  return (
    <div className="mt-12 w-full max-w-3xl">
      <h3 className="text-3xl font-semibold mb-5">Liked Songs</h3>
      <ul className="space-y-3">
        {songs.map((song, i) => (
          <li
            key={i}
            className="bg-gray-900 rounded-xl py-3 px-5 shadow-lg flex justify-between items-center
                       hover:bg-gray-800 transition duration-300"
          >
            <div>
              <h4 className="font-medium">{song.title}</h4>
              <p className="text-gray-400 text-sm">{song.artist}</p>
            </div>
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                         text-white px-4 py-2 rounded-full shadow-lg transform hover:scale-105
                         transition duration-300"
            >
              ▶ Play
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
