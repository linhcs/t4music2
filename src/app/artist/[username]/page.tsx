"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import ArtistCard from "../components/ArtistCard";
import ArtistAlbums from "../components/ArtistAlbums";
import TopTracks from "../components/TopTracks";
import ArtistBio from "../components/ArtistBio";
import { useUserStore } from "@/store/useUserStore";
import PlayBar from "@/components/ui/playBar";
import { useAudioPlayer } from "@/context/AudioContext";
import type { Artist } from "../components/ArtistCard";

export default function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const { user_id } = useUserStore();

  const { currentSong, isPlaying, progress, togglePlayPause, handleSeek, volume, setVolume } =
    useAudioPlayer();

  useEffect(() => {
    const fetchArtist = async () => {
      const res = await fetch(`/api/artists/${username}?viewer=${user_id}`);
      const data: Artist = await res.json();
      setArtist(data);  // Ensure that the `data` fits the expected `Artist` structure
    };
    if (username && user_id !== -1) fetchArtist();
  }, [username, user_id]);

  if (!artist) return <div className="text-white p-6">Loading artist profile...</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />
      <ArtistCard artist={artist} />
      <div className="relative max-w-6xl mx-auto px-6 pb-10 space-y-12 mt-8">
        <TopTracks tracks={artist.topTracks} />  
        <ArtistAlbums albums={artist.album} />
        <ArtistBio />
      </div>

      {currentSong && (
        <PlayBar
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={togglePlayPause}
          onSeek={handleSeek}
          volume={volume}
          setVolume={setVolume}
        />
      )}
    </div>
  );
}
