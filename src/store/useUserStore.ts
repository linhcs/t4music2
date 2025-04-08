import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Song = {
  song_id: number;
  title: string;
  genre?: string;
  file_path: string;
  liked_at?: string;
  played_at?: string;
  userId?: number;
  users?: {
    username: string;
    pfp?: string;
  };
  album?: {
    title?: string;
    album_art?: string;
  };
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

type Playlist = {
  playlist_id: number;
  name: string;
  playlist_art?: string;
};

type FollowedArtist = {
  userId: number;
  username: string;
  pfp?: string;
};

type UserStore = {
  userId: number | null;
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
  topTracks: Song[];

  // Actions
  setUser: (username: string, role: string, pfp?: string, userId?: number | null) => void;
  setUserId: (id: number) => void;
  setPfp: (pfp: string) => void;
  setLikedSongs: (songs: Song[]) => void;
  setPlaylists: (lists: Playlist[]) => void;
  setStreamingHistory: (songs: Song[]) => void;
  setFollowers: (count: number) => void;
  setFollowing: (count: number) => void;
  setPlaylistCount: (count: number) => void;
  setFollowedArtists: (artists: FollowedArtist[]) => void;
  setFollowingList: (ids: number[]) => void;
  setTopTracks: (songs: Song[]) => void;
  logout: () => void;
  toggleLike: (song: Song) => void;
  setPfp: (pfp: string) => void; //new type for setting profile pictures (pfp is a url to an image in an azure blob)
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
      userId: null,
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

      // Setters
      setUser: (username, role, pfp = "", userId = null) =>
        set({ username, role, pfp, userId, isLoggedIn: true }),
      setUserId: (id) => set({ userId: id }),
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
        set({
          userId: -1,
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
        });
      },
      // Toggle like/unlike a song
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
