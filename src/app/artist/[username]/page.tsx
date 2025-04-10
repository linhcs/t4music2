"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import ArtistCard from "../components/ArtistCard";
import ArtistAlbums from "../components/ArtistAlbums";
import TopTracks from "../components/TopTracks";
import ArtistBio from "../components/ArtistBio";
import { useUserStore } from "@/store/useUserStore";
import type { Artist } from "../components/ArtistCard"; // ✅ Only keep this

export default function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const { user_id } = useUserStore();

  useEffect(() => {
    const fetchArtist = async () => {
      const res = await fetch(`/api/artists/${username}?viewer=${user_id}`);
      const data = await res.json();
      console.log(data);  // Check if the data is structured correctly
      setArtist(data);
    };
    if (username && user_id !== -1) fetchArtist();
  }, [username, user_id]);

  if (!artist || !artist.songs || artist.songs.length === 0) {
    return <div className="text-white p-6">No songs available.</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />
      <ArtistCard artist={artist} />
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 mt-8">
        <ArtistAlbums albums={artist.album} />
        <TopTracks tracks={artist.songs} />
        <ArtistBio />
      </div>
    </div>
  );
}
