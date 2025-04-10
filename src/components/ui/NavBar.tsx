"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaHome, FaSearch, FaBell, FaUserCircle, FaTimes } from "react-icons/fa";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { useAudioPlayer } from "@/context/AudioContext";
import { Song } from "../../../types";
import { useRef } from "react";

interface NavBarProps {
  role?: "listener" | "artist" | "admin";
}

type SongResult = {
  song_id: number;
  title: string;
  genre: string;
  file_path: string;
  album?: {
    album_art?: string;
  };
};

type ArtistResult = {
  user_id: number;
  username: string;
  pfp?: string;
};

export default function NavBar({ role = "listener" }: NavBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ songs: SongResult[]; artists: ArtistResult[] }>({ songs: [], artists: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const username = useUserStore((state) => state.username);
  const user_id = useUserStore((state) => state.user_id);
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudioPlayer();
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  function logout() {
    const store = useUserStore.getState();
    store.logout();
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    router.push("/");
  }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults({ songs: [], artists: [] });
        setShowDropdown(false);
        return;
      }

      try {
        const res = await fetch(`/api/songs/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        setResults({
          songs: data.songs || [],
          artists: data.artists || [],
        });
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults({ songs: [], artists: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (user_id) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`/api/notifications?userId=${user_id}`);
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };

      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user_id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await fetch(`/api/notifications?notificationId=${notificationId}`, {
        method: 'DELETE',
      });
      setNotifications(notifications.filter(n => n.notification_id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  let profileRoute = "/profile/user";
  if (role === "artist") {
    profileRoute = "/profile/artist";
  } else if (role === "admin") {
    profileRoute = "/reportadmin";
  }

  return (
    <nav className="bg-black text-white px-5 py-2 shadow-md">
      <div className="w-full flex items-center justify-between px-4">
        <Link href="/home" className="hover:text-gray-300">
          <FaHome size={24} />
        </Link>

    <div ref={searchRef} className="relative max-w-xl mx-auto flex-1">
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1px] rounded-xl w-full max-w-xl mx-auto">
  <div className="relative flex items-center group bg-black rounded-xl">
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for songs, artists, albums, genres..."
      className="w-full py-2 px-4 bg-black text-white placeholder-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80 transition-all duration-300 ease-in-out truncate"
    />
    <FaSearch className="absolute right-4 text-white" />
    {searchTerm && (
      <button
        onClick={() => setSearchTerm("")}
        className="absolute right-10 text-gray-400 hover:text-white transition-colors"
        aria-label="Clear search"
      >
        <FaTimes />
      </button>
    )}
  </div>
</div>
          {showDropdown && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-full max-w-md z-50">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1px] rounded-xl shadow-xl">
                <div className="bg-black rounded-xl p-4 space-y-3 border border-white/10 max-h-96 overflow-y-auto">

                  {/* Artist Results */}
                  {results.artists.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-white">Artist Profiles</h3>
                      {results.artists.map((artist) => (
                        <div
                          key={artist.user_id}
                          onClick={() => {
                            router.push(`/artist/${artist.username}`);
                            setShowDropdown(false);
                            setSearchTerm("");
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
                        >
                          {artist.pfp && (
                            <img
                              src={artist.pfp || "/default.jpg"}
                              className="w-8 h-8 rounded-full object-cover"
                              alt={artist.username}
                            />
                          )}
                          <span className="text-white text-sm">@{artist.username}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Song Results */}
                  {results.songs.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-white mt-2">Songs</h3>
                      {results.songs.map((song) => {
                        const isThisPlaying = currentSong?.song_id === song.song_id && isPlaying;
                        return (
                          <div
                            key={song.song_id}
                            className="flex items-center justify-between gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
                          >
                            <div
                              className="flex items-center gap-3 overflow-hidden"
                              onClick={() => {
                                playSong(song as Song);
                                setShowDropdown(false);
                                setSearchTerm("");
                              }}
                            >
                              {song.album?.album_art && (
                                <img
                                  src={song.album.album_art}
                                  alt={song.title}
                                  className="w-9 h-9 rounded object-cover shrink-0"
                                />
                              )}
                              <div className="truncate">
                                <p className="text-white text-sm font-medium truncate">{song.title}</p>
                                <p className="text-xs text-gray-400 truncate">{song.genre}</p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isThisPlaying) {
                                  togglePlayPause();
                                } else {
                                  playSong(song as Song);
                                }
                              }}
                              className="shrink-0 hover:scale-110 transition-transform"
                              aria-label={isThisPlaying ? "Pause" : "Play"}
                            >
                              {isThisPlaying ? (
                                <FiPauseCircle className="text-white text-xl" />
                              ) : (
                                <FiPlayCircle className="text-white text-xl" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* No Results */}
                  {results.artists.length === 0 && results.songs.length === 0 && (
                    <div className="text-gray-400 text-sm">No results found</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Profile & Notifications */}
        <div className="flex items-center space-x-4 z-50">
          <Menu as="div" className="relative" ref={notificationsRef}>
            <MenuButton 
              className="hover:text-gray-300 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </MenuButton>
            {showNotifications && (
              <MenuItems className="absolute right-0 mt-2 z-50 w-72 bg-gray-800 rounded-md shadow-xl ring-1 ring-black ring-opacity-5">
                <div className="py-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.notification_id} className="px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(notification.notification_id)}
                          className="text-gray-400 hover:text-white ml-2"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 px-4 py-2 text-sm">No notifications</div>
                  )}
                </div>
              </MenuItems>
            )}
          </Menu>

          <Menu as="div" className="relative">
            <MenuButton>
              <FaUserCircle size={24} className="hover:text-gray-300" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-50 mt-2 w-56 bg-gray-800 rounded-md shadow-xl ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-700">
                  Logged in as <span className="text-white font-medium">{username || "User"}</span>
                </div>
                <MenuItem>
                  <Link
                     href={profileRoute}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
