import { create } from "zustand";
import { persist } from "zustand/middleware";

type Song = {
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
    album_art?: string;
  };
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
  userId : number | null;
  username: string;
  role: string;
  topTracks: Song[];
  setTopTracks: (songs: Song[]) => void;
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

  setUser: (username: string, role: string, pfp?: string, userId?: number | null) => void;
  setLikedSongs: (songs: Song[]) => void;
  setPlaylists: (lists: Playlist[]) => void;
  setStreamingHistory: (songs: Song[]) => void;
  setFollowers: (count: number) => void;
  setFollowing: (count: number) => void;
  setPlaylistCount: (count: number) => void;
  setFollowedArtists: (artists: FollowedArtist[]) => void;
  setFollowingList: (ids: number[]) => void;
  setUserId: (id: number) => void;
  clearUser: () => void;
  toggleLike: (song: Song) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userId: null,
      username: "",
      role: "",
      pfp: "",
      followers: 0,
      following: 0,
      topTracks: [],
setTopTracks: (songs) => set({ topTracks: songs }),
      followingList: [],
      playlistCount: 0,
      isLoggedIn: false,
      likedSongs: [],
      playlists: [],
      streamingHistory: [],
      followedArtists: [],

      setUser: (username, role, pfp = "", userId = null) =>
        set({ username, role, isLoggedIn: true, pfp, userId }),

      setUserId: (id) => set({ userId: id }),
      setLikedSongs: (songs) => set({ likedSongs: songs }),
      setPlaylists: (lists) => set({ playlists: lists }),
      setStreamingHistory: (songs) => set({ streamingHistory: songs }),
      setFollowers: (count) => set({ followers: count }),
      setFollowing: (count) => set({ following: count }),
      setPlaylistCount: (count) => set({ playlistCount: count }),
      setFollowedArtists: (artists) => set({ followedArtists: artists }),
      setFollowingList: (ids) => set({ followingList: ids }),

      clearUser: () =>
        set({
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
          topTracks: [],
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
