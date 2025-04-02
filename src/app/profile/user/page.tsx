"use client";
import UserCard from '../components/User/UserCard';
import UserStats from '../components/User/UserStats';
import ProfileSettingsButton from '../components/ProfileSettingsButton';
import DeleteAccountButton from '../components/DeleteAccountButton';
import UserPlaylists from '../components/User/UserPlaylists';
import ArtistsFollowing from '../components/User/ArtistsFollowing';
import NavBar from '@/components/ui/NavBar';

export default function UserProfilePage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />
      {/* Hero-style banner at top */}
      <UserCard />

      {/* Main content container with a smooth overlap for a seamless transition */}
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 -mt-14">
        {/* Listener statistics */}
        <UserStats />

        {/* Albums section (includes the dedicated "Liked Songs" album) */}
        <UserPlaylists isArtist={false} />

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
