"use client";

import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import PlayBar from "@/components/ui/playBar";
import { useUserStore } from "@/store/useUserStore";
import CreatePlaylistModal from "@/app/profile/components/User/CreatePlaylistModal";
import { createPlaylist } from "@/app/actions/createPlaylist";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  const { currentSong, isPlaying, progress, playSong, audioRef } = useAudioPlayer();

  const user_id = useUserStore((state) => state.user_id);
  const playlists = useUserStore((state) => state.playlists);
  const setPlaylists = useUserStore((state) => state.setPlaylists);
  const showPlaylistModal = useUserStore((state) => state.showPlaylistModal);
  const setShowPlaylistModal = useUserStore((state) => state.setShowPlaylistModal);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleCreatePlaylist = async (name: string, playlist_art: string) => {
    if (!user_id) return;
    const newPlaylist = await createPlaylist(name, user_id, playlist_art);
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    setShowPlaylistModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-1">{children}</main>

      {hasMounted && currentSong && (
        <>
          <audio ref={audioRef} autoPlay hidden src={audioRef.current?.src} />
          <PlayBar
            currentSong={currentSong}
            isPlaying={isPlaying}
            progress={progress}
            onPlayPause={() => currentSong && playSong(currentSong)}
            onSeek={(e) => {
              if (!audioRef.current) return;
              const bar = e.currentTarget;
              const percent =
                (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth;
              audioRef.current.currentTime = percent * audioRef.current.duration;
            }}
          />
        </>
      )}

      {/* ✅ Global Playlist Modal */}
      {showPlaylistModal && (
        <CreatePlaylistModal
          onClose={() => setShowPlaylistModal(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </div>
  );
}
