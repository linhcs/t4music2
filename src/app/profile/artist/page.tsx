"use client";
import ArtistCard from '../components/Artist/ArtistCard';
import ArtistUserStats from '../components/Artist/ArtistUserStats';
import ProfileSettingsButton from '../components/ProfileSettingsButton';
import DeleteAccountButton from '../components/DeleteAccountButton';
import ArtistAlbums from '../components/Artist/ArtistAlbums';
import TopTracks from '../components/Artist/TopTracks';
import ArtistBio from '../components/Artist/ArtistBio';
import ArtistActions from '../components/Artist/ArtistActions';

export default function ArtistProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full-width hero banner at the top */}
      <ArtistCard />

      {/* Main content container below the banner */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Expandable artist bio */}
        <ArtistBio />

        {/* Artist-specific stats (followers, streams, etc.) */}
        <ArtistUserStats />

        {/* Albums created by the artist */}
        <ArtistAlbums />

        {/* Top performing tracks */}
        <TopTracks />

        {/* Action buttons for editing profile, adding songs or albums */}
        <ArtistActions />

        {/* Profile settings and account management */}
        <div className="flex flex-wrap gap-6 justify-center mt-8">
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
