export default function ArtistCard() {
  return (
    <div className="relative w-full h-80 overflow-hidden bg-black">
      {/* Background Image */}
      <img
        src="artist-banner.jpg"
        alt="Artist Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black" />

      {/* Foreground Content (Avatar & Text) */}
      <div className="relative z-10 flex items-end h-full px-8 pb-6">
        <div className="flex items-center gap-6">
          <img
            src="/artist-default.jpg"
            alt="Artist Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-xl"
          />
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-white">Artist Name</h1>
            <p className="text-gray-300 mt-1">10,532,242 monthly listeners</p>
            <p className="text-gray-400 text-sm">Pop • Songwriter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
