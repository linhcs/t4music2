"use client";

import NavBar from "@/components/ui/NavBar";
import ArtistCard from "./components/ArtistCard";
import ArtistAlbums from "./components/ArtistAlbums";
import TopTracks from "./components/TopTracks";
import ArtistBio from "./components/ArtistBio";

export default function ArtistPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar role="listener" />
      {/* Hero Banner with follow button inside */}
      <ArtistCard />
      {/* Main content container */}
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 mt-8">
        <ArtistAlbums />
        <TopTracks />
        <ArtistBio />
      </div>
    </div>
  );
}
