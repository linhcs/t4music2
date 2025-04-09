import { Song, Playlist } from "@/types";

export const getLikedSongsPlaylist = (likedSongs: Song[]): Playlist => ({
  playlist_id: "liked",
  name: "💗 Liked Songs",
  playlist_art: "/likedsong/liked_songs.jpg",
  isLiked: true,
  songs: likedSongs.map((song) => ({
    ...song,
    duration: song.duration ?? 0,
    file_format: song.file_format ?? "mp3",
    user_id: song.user_id ?? 0,
  })),
});
