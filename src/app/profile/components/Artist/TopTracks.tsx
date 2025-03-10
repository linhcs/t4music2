"use client";

export default function TopTracks() {
  const topTracks = [
    { title: "Song A", plays: "500K", img: "/track1.jpg" },
    { title: "Song B", plays: "320K", img: "/track2.jpg" },
    { title: "Song C", plays: "200K", img: "/track3.jpg" },
  ];

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-3xl font-semibold mb-5">Top Tracks</h3>
      <ul className="space-y-4">
        {topTracks.map((track, index) => (
          <li
            key={index}
            className="bg-gray-900 py-3 px-5 rounded-xl shadow-lg flex items-center justify-between hover:bg-gray-800 transition duration-300"
          >
            <div className="flex items-center gap-4">
              <img
                src={track.img}
                alt={track.title}
                className="w-12 h-12 object-cover rounded-md"
              />
              <span className="font-medium text-lg">{track.title}</span>
            </div>
            <span className="text-gray-400 font-medium">{track.plays} plays</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
