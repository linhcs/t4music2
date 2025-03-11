"use client";

export default function ArtistActions() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8">
      <button className="bg-white text-black font-semibold py-2 px-6 rounded-full shadow hover:bg-gray-200 transition duration-300">
        Edit Artist Profile
      </button>
      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-300">
        + Add Album or Song
      </button>
    </div>
  );
}
