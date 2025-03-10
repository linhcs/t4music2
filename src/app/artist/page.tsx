import ArtistCard from './components/ArtistCard';
import ArtistAlbums from './components/ArtistAlbums';
import TopTracks from './components/TopTracks';
import ArtistBio from './components/ArtistBio';

export default function ArtistPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Banner */}
      <ArtistCard />

      {/* Main content container */}
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 -mt 0">
        <ArtistAlbums />
        <TopTracks />
        <ArtistBio />
      </div>
    </div>
  );
}
