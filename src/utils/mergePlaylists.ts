import { Song } from "@/types";

export type Playlist = {
  playlist_id: number | "liked";
  name: string;
  playlist_art?: string;
  isLiked?: boolean;
  songs?: Song[];
};

export function mergeWithLikedPlaylist(
  playlists: Playlist[],
  likedSongs: Song[]
): Playlist[] {
  const likedPlaylist: Playlist = {
    playlist_id: "liked",
    name: "💗 Liked Songs",
    playlist_art: "/likedsong/liked_songs.jpg",
    isLiked: true,
    songs: likedSongs,
  };

  const hasLiked = playlists.some((p) => p.playlist_id === "liked");
  const merged = hasLiked ? playlists : [likedPlaylist, ...playlists];

  const unique = merged.filter(
    (item, index, self) =>
      index === self.findIndex((p) => p.playlist_id === item.playlist_id)
  );

  return unique;
}
