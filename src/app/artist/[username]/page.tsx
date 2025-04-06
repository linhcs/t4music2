"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import ArtistCard from "../components/ArtistCard";
import ArtistAlbums from "../components/ArtistAlbums";
import TopTracks from "../components/TopTracks";
import ArtistBio from "../components/ArtistBio";

export default function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const [artist, setArtist] = useState<any>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      const res = await fetch(`/api/artists/${username}`);
      const data = await res.json();
      setArtist(data);
    };
    if (username) fetchArtist();
  }, [username]);

  if (!artist) return <div className="text-white p-6">Loading artist profile...</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar role="listener" />
      <ArtistCard artist={artist} />
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 mt-8">
        <ArtistAlbums albums={artist.album} />
        <TopTracks tracks={artist.songs} />
        <ArtistBio bio={artist.bio} />
      </div>
    </div>
  );
}
