import { create } from "zustand";
import { persist } from "zustand/middleware"; // saving data across pages 
type Song = {
  song_id: number;
  title: string;
  genre?: string;
  file_path: string;
  liked_at?: string;
  played_at?: string;
};

type Playlist = {
  playlist_id: number;
  name: string;
  playlist_art?: string;
};

type UserStore = {
  username: string;
  role: string;
  isLoggedIn: boolean;
  likedSongs: Song[];
  playlists: Playlist[];
  streamingHistory: Song[];
  setUser: (username: string, role: string) => void;
  setLikedSongs: (songs: Song[]) => void;
  setPlaylists: (lists: Playlist[]) => void;
  setStreamingHistory: (songs: Song[]) => void;
  logout: () => void;
  toggleLike: (song: Song) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      username: "",
      role: "",
      isLoggedIn: false,
      likedSongs: [],
      playlists: [],
      streamingHistory: [],
      setUser: (username, role) =>
        set({ username, role, isLoggedIn: true }),
      setLikedSongs: (songs) =>
        set({ likedSongs: songs }),
      setPlaylists: (lists) =>
        set({ playlists: lists }),
      setStreamingHistory: (songs) =>
        set({ streamingHistory: songs }),
      logout: () =>
        set({
          username: "",
          role: "",
          isLoggedIn: false,
          likedSongs: [],
          playlists: [],
          streamingHistory: [],
        }),
      toggleLike: (song) =>
        set((state) => {
          const isLiked = state.likedSongs.some((s) => s.song_id === song.song_id);
          return {
            likedSongs: isLiked
              ? state.likedSongs.filter((s) => s.song_id !== song.song_id)
              : [...state.likedSongs, song],
          };
        }),
    }),
    {
      name: "user-storage", // key in localStorage
    }
  )
);
