"use client";
import UserCard from "../../../profile/components/User/UserCard";
import ProfileSettingsButton from "../../../profile/components/ProfileSettingsButton";
import DeleteAccountButton from "../../../profile/components/DeleteAccountButton";
import UserAlbums from "../../../profile/components/User/UserAlbums";
import ArtistsFollowing from "../../../profile/components/User/ArtistsFollowing";
import NavBar from "@/components/ui/NavBar";
import TopArtists from "../../../profile/components/User/TopArtists";
import TopTracks from "../../../profile/components/User/TopTracks";
import { useParams } from "next/navigation";


export default function UserProfilePage() {
  const { userId } = useParams();

  console.log("User ID:", userId); 
  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />

      {/* Hero-style banner at top */}
      <UserCard />

      <div className="relative max-w-8xl mx-auto px-6 pb-10 space-y-12 mt-6">
        {/* Top Artists */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Artists This Month</h2>
          <TopArtists />
        </div>

        {/* Top Tracks */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Tracks This Month</h2>
          <TopTracks />
        </div>
        {/* Artists the user follows */}
        <ArtistsFollowing />

        {/* Albums section */}
        <UserAlbums isArtist={false} />


        {/* Profile settings and account management */}
        <div className="flex flex-wrap gap-6 justify-center">
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
