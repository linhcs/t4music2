"use client";
import UserCard from '../components/User/UserCard';
import UserStats from '../components/User/UserStats'; // or RegularUserStats if you prefer
import ProfileSettingsButton from '../components/ProfileSettingsButton';
import DeleteAccountButton from '../components/DeleteAccountButton';
import UserAlbums from '../components/User/UserAlbums';
import ArtistsFollowing from '../components/User/ArtistsFollowing';

export default function UserProfilePage() {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero-style banner at top */}
      <UserCard />

      {/* Main content container below the banner */}
      <div className="max-w-4xl mx-auto p-6 space-y-10">
        {/* Listener statistics */}
        <UserStats />

        {/* Albums (includes "Liked Songs" album) */}
        <UserAlbums isArtist={false} />

        {/* Artists the user follows */}
        <ArtistsFollowing />

        {/* Profile settings and account management */}
        <div className="flex flex-wrap gap-6 justify-center">
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
