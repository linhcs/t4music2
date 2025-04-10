import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song as song2 } from "@/types";

export type Song = {
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
    title?: string;
    album_art?: string;
  };

  artist_username?: string;
  artist_id?: number;
  artist_pfp?: string;
};
type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  setSong: (song: Song) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  reset: () => void;
};

export type Playlist = {
  playlist_id: number | "liked";
  name: string;
  playlist_art?: string;
};

type FollowedArtist = {
  user_id: number;
  username: string;
  pfp?: string;
};

type UserStore = {
  user_id: number | null;
  username: string;
  role: string;
  pfp?: string;
  followers: number;
  following: number;
  followingList: number[];
  playlistCount: number;
  isLoggedIn: boolean;
  likedSongs: Song[];
  playlists: Playlist[];
  streamingHistory: Song[];
  followedArtists: FollowedArtist[];
  topTracks: song2[];

  // Playlist modal support
  showPlaylistModal: boolean;
  setShowPlaylistModal: (show: boolean) => void;

  // Actions
  setUser: (username: string, role: string, pfp?: string, user_id?: number | null) => void;
  setuser_id: (id: number) => void;
  setPfp: (pfp: string) => void;
  setLikedSongs: (songs: Song[]) => void;
  setPlaylists: (lists: Playlist[]) => void;
  setStreamingHistory: (songs: Song[]) => void;
  setFollowers: (count: number) => void;
  setFollowing: (count: number) => void;
  setPlaylistCount: (count: number) => void;
  setFollowedArtists: (artists: FollowedArtist[]) => void;
  setFollowingList: (ids: number[]) => void;
  setTopTracks: (songs: song2[]) => void;
  logout: () => void;
  toggleLike: (song: Song) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  progress: 0,
  setSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setProgress: (progress) => set({ progress }),
  reset: () => set({ currentSong: null, isPlaying: false, progress: 0 }),
}));

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user_id: null,
      username: "",
      role: "",
      pfp: "",
      followers: 0,
      following: 0,
      followingList: [],
      playlistCount: 0,
      isLoggedIn: false,
      likedSongs: [],
      playlists: [],
      streamingHistory: [],
      followedArtists: [],
      topTracks: [],
      showPlaylistModal: false,
      setShowPlaylistModal: (show) => set({ showPlaylistModal: show }),

      setUser: (username, role, pfp = "", user_id = null) =>
        set({ username, role, pfp, user_id, isLoggedIn: true }),
      setuser_id: (id) => set({ user_id: id }),
      setPfp: (pfp) => set({ pfp }),
      setLikedSongs: (songs) => set({ likedSongs: songs }),
      setPlaylists: (lists) => set({ playlists: lists }),
      setStreamingHistory: (songs) => set({ streamingHistory: songs }),
      setFollowers: (count) => set({ followers: count }),
      setFollowing: (count) => set({ following: count }),
      setPlaylistCount: (count) => set({ playlistCount: count }),
      setFollowedArtists: (artists) => set({ followedArtists: artists }),
      setFollowingList: (ids) => set({ followingList: ids }),
      setTopTracks: (songs) => set({ topTracks: songs }),

      logout: () => {
        usePlayerStore.getState().reset();
        if (typeof window !== "undefined") {
          localStorage.removeItem("user-storage");
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
        }

        set({
          user_id: null,
          username: "",
          role: "",
          pfp: "",
          followers: 0,
          following: 0,
          followingList: [],
          playlistCount: 0,
          isLoggedIn: false,
          likedSongs: [],
          playlists: [],
          streamingHistory: [],
          followedArtists: [],
          topTracks: [],
          showPlaylistModal: false,
        });
      },

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
