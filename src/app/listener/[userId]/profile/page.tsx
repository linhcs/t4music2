"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

import UserCard from "../../../profile/components/User/UserCard";
import ProfileSettingsButton from "../../../profile/components/ProfileSettingsButton";
import DeleteAccountButton from "../../../profile/components/DeleteAccountButton";
import UserAlbums from "../../../profile/components/User/UserPlaylists";
import ArtistsFollowing from "../../../profile/components/User/ArtistsFollowing";
import NavBar from "@/components/ui/NavBar";
import TopArtists from "../../../profile/components/User/TopArtists";
import TopTracks from "../../../profile/components/User/TopTracks";
import UserPlaylists from "../../../profile/components/User/UserPlaylists";

export default function UserProfilePage() {
  const { userId } = useParams();
  const setTopTracks = useUserStore((state) => state.setTopTracks);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();

        if (data?.topTracks) {
          setTopTracks(data.topTracks);
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };

    fetchUserData();
  }, [userId, setTopTracks]);

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
        <UserPlaylists/>

        {/* Profile settings and account management */}
        <div className="flex flex-wrap gap-6 justify-center">
          <ProfileSettingsButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
