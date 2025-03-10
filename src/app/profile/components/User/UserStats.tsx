"use client";

export default function UserStats() {
  const stats = [
    { label: "Songs Played", count: "532" },
    { label: "Artists Followed", count: "104" },
    { label: "Listening Hours", count: "216 hrs" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full max-w-2xl mx-auto">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-gray-900 rounded-2xl p-5 text-center shadow-lg
                     hover:-translate-y-2 transition-transform duration-300"
        >
          <h3 className="text-3xl font-semibold mb-1">{stat.count}</h3>
          <p className="text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
