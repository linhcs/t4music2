import { create } from "zustand";
import { persist } from "zustand/middleware";

type Song = {
  song_id: number;
  title: string;
  genre?: string;
  file_path: string;
  liked_at?: string;
  played_at?: string;
  user_id?: number;
  users?: {
    username: string;
    pfp?: string;
  };
  album?: {
    album_art?: string;
  };
};

type Playlist = {
  playlist_id: number;
  name: string;
  playlist_art?: string;
};

type FollowedArtist = {
  user_id: number;
  username: string;
  pfp?: string;
};


type UserStore = {
  username: string;
  role: string;
  pfp?: string;
  followers: number;
  following: number;
  playlistCount: number;
  isLoggedIn: boolean;
  likedSongs: Song[];
  playlists: Playlist[];
  streamingHistory: Song[];
  followedArtists: FollowedArtist[];
  setUser: (username: string, role: string, pfp?: string) => void;
  setLikedSongs: (songs: Song[]) => void;
  setPlaylists: (lists: Playlist[]) => void;
  setStreamingHistory: (songs: Song[]) => void;
  setFollowers: (count: number) => void;
  setFollowing: (count: number) => void;
  setPlaylistCount: (count: number) => void;
  setFollowedArtists: (artists: FollowedArtist[]) => void;
  logout: () => void;
  toggleLike: (song: Song) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      username: "",
      role: "",
      pfp: "",
      followers: 0,
      following: 0,
      playlistCount: 0,
      isLoggedIn: false,
      likedSongs: [],
      playlists: [],
      streamingHistory: [],
      followedArtists: [],

      setUser: (username, role, pfp = "") =>
        set({ username, role, isLoggedIn: true, pfp }),

      setLikedSongs: (songs) => set({ likedSongs: songs }),
      setPlaylists: (lists) => set({ playlists: lists }),
      setStreamingHistory: (songs) => set({ streamingHistory: songs }),
      setFollowers: (count) => set({ followers: count }),
      setFollowing: (count) => set({ following: count }),
      setPlaylistCount: (count) => set({ playlistCount: count }),
      setFollowedArtists: (artists) => set({ followedArtists: artists }),

      logout: () =>
        set({
          username: "",
          role: "",
          pfp: "",
          followers: 0,
          following: 0,
          playlistCount: 0,
          isLoggedIn: false,
          likedSongs: [],
          playlists: [],
          streamingHistory: [],
          followedArtists: [],
        }),

      toggleLike: (song) => {
        const { likedSongs } = get();
        const isLiked = likedSongs.some((s) => s.song_id === song.song_id);
        set({
          likedSongs: isLiked
            ? likedSongs.filter((s) => s.song_id !== song.song_id)
            : [...likedSongs, song],
        });
      },
    }),
    {
      name: "user-storage",
    }
  )
);
