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
    title: string;
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
  user_id: number;
  username: string;
  pfp?: string;
};

type UserStore = {
  user_id: number;
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
  setUser: (user_id: number, username: string, role: string, pfp?: string) => void;
  setLikedSongs: (songs: Song[]) => void;
  setPlaylists: (lists: Playlist[]) => void;
  setStreamingHistory: (songs: Song[]) => void;
  setFollowers: (count: number) => void;
  setFollowing: (count: number) => void;
  setPlaylistCount: (count: number) => void;
  setFollowedArtists: (artists: FollowedArtist[]) => void;
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
      user_id: -1,
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

      setUser: (user_id, username, role, pfp = "") =>
        set({ user_id, username, role, isLoggedIn: true, pfp }),

      setLikedSongs: (songs) => set({ likedSongs: songs }),
      setPlaylists: (lists) => set({ playlists: lists }),
      setStreamingHistory: (songs) => set({ streamingHistory: songs }),
      setFollowers: (count) => set({ followers: count }),
      setFollowing: (count) => set({ following: count }),
      setPlaylistCount: (count) => set({ playlistCount: count }),
      setFollowedArtists: (artists) => set({ followedArtists: artists }),

      logout: () =>{
        usePlayerStore.getState().reset();
        set({
          user_id: -1,
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
        setPfp: (pfp) => set({ pfp }), //action to only update user profile picture

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
