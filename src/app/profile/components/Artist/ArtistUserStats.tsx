"use client";

export default function ArtistUserStats() {
  const stats = [
    { label: "Monthly Listeners", count: "150K" },
    { label: "Songs Uploaded", count: "28" },
    { label: "Albums Created", count: "6" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 w-full max-w-2xl">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-gray-900 rounded-xl p-5 shadow-xl text-center hover:bg-gray-800 transition"
        >
          <h3 className="text-3xl font-semibold mb-1">{stat.count}</h3>
          <p className="text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
