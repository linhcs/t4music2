"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaHome, FaSearch, FaBell, FaUserCircle, FaTimes } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
console.log(classNames)// can delete later
interface NavBarProps {
  role?: "listener" | "artist" | "admin";
}

export default function NavBar({ role = "listener" }: NavBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ username: string; user_id: number; pfp?: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const username = useUserStore((state) => state.username); // not too sure if this is right cries

  function logout() {
    const store = useUserStore.getState();
    store.logout();
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    router.push("/login");
  }

   useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const res = await fetch("/api/search/artists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchTerm }),
        });

        if (!res.ok) {
          console.error("Server error:", res.status);
          setResults([]);
          return;
        }

        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching artists:", error);
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSelect = (username: string) => {
    router.push(`/artist/${username}`);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const notifications = [
    { id: 1, message: "New song released: 'Summer Vibes'" },
    { id: 2, message: "Your album 'Chill Vibes' was liked" },
    { id: 3, message: "New artist trending near you" },
  ];

  return (
    <nav className="bg-black text-white px-5 py-2 shadow-md">
      <div className="w-full flex items-center justify-between px-4">
        {/* Left - Home */}
        <Link href="/home" className="hover:text-gray-300">
          <FaHome size={24} />
        </Link>

        {/* Center - Search */}
        <div className="relative max-w-xl mx-auto flex-1">
          <div className="relative flex items-center group w-full max-w-md mx-auto"> {/*added flexbox to keep search within playbar*/}
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for artists..."
            className="w-full py-2 px-4 rounded-full bg-gray-800 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white
            focus:ring-opacity-80 transition-all duration-300 ease-in-out border border-gray-700 hover:border-gray-600 group-hover:shadow-lg group-hover:shadow-white/50 truncate" 
          /> {/*added glow effect*/}
          {/*search bar is responsive to screen resizing*/}
          <FaSearch className="absolute right-4 text-gray-400" />
          {searchTerm && (
            <button
             onClick={() => setSearchTerm('')}
             className="absolute right-10 text-gray-400 hover:text-white transition-colors"
             aria-label="Clear search" >
              <FaTimes />
            </button>
           )}
          </div>
          

          {showDropdown && results.length > 0 && (
            <ul className="absolute z-50 w-full bg-gray-900 mt-2 rounded-xl shadow-lg max-h-60 overflow-y-auto border border-gray-700">
              {results.map((artist) => (
                <li
                  key={artist.user_id}
                  onClick={() => handleSelect(artist.username)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer text-white"
                >
                  {artist.pfp && (
                    <img
                      src={artist.pfp}
                      alt={artist.username}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  @{artist.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right - Notifications & Menu */}
        <div className="flex items-center space-x-4 z-50"> {/*added z-50 to ensure drop down appears in front of other elements*/}
          <Menu as="div" className="relative">
            <MenuButton className="hover:text-gray-300">
              <FaBell size={20} />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 z-50 w-72 bg-gray-800 rounded-md shadow-xl ring-1 ring-black ring-opacity-5">
              <div className="py-2">
                {notifications.length === 0 ? (
                  <div className="text-gray-400 px-4 py-2 text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <MenuItem key={n.id}>
                      <div className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                        {n.message}
                      </div>
                    </MenuItem>
                  ))
                )}
              </div>
            </MenuItems>
          </Menu>

          {/* Profile Menu */}
          <Menu as="div" className="relative">
            <MenuButton>
              <FaUserCircle size={24} className="hover:text-gray-300" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-50 mt-2 w-56 bg-gray-800 rounded-md shadow-xl ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-700">
                  Logged in as{" "}
                  <span className="text-white font-medium">
                    {username || "User"}
                  </span>
                </div>

                <MenuItem>
                  <Link
                    href={role === "artist" ? "/profile/artist" : "/profile/user"}
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
                    onClick={() => {
                      logout();
                    }}
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