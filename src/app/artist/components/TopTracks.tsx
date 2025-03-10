export default function TopTracks() {
  const tracks = [
    { title: "Track One", img: "/artist-placeholder.jpg" },
    { title: "Track Two", img: "/artist-placeholder.jpg" },
    { title: "Track Three", img: "/artist-placeholder.jpg" },
    { title: "Track Four", img: "/artist-placeholder.jpg" },
    { title: "Track Five", img: "/artist-placeholder.jpg" },
  ];

  return (
    <div className="mt-12 w-full max-w-3xl">
      <h3 className="text-3xl font-semibold mb-5">Top Tracks</h3>
      <ul className="space-y-4">
        {tracks.map((track, index) => (
          <li
            key={index}
            className="bg-gray-900 py-3 px-5 rounded-xl shadow-lg flex items-center justify-between hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-4">
              <img 
                src={track.img} 
                className="w-12 h-12 object-cover rounded-md"
              />
              <span className="font-medium text-lg">{track.title}</span>
            </div>

            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition duration-300">
              ▶ Play
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
