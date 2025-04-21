"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaChartBar,
  FaClock,
  FaMusic,
  FaPlay,
  FaUsers,
  FaTrashAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import NewSignupsTable from "./component/NewSignupsTable";
import TopListenersTable from "./component/TopListenersTable";

interface Artist {
  user_id: number;
  name: string;
  genre: string;
  followers: number;
  play_count: number;
  total_songs: number;
  total_streaming_minutes: number;
}

interface Song {
  song_id: number;
  title: string;
  artist: string;
  genre: string;
  play_count: number;
}

interface GenreData {
  genre: string;
  count: number;
}

interface MonthlyStats {
  month: string;
  total_play_time: number;
  total_songs_added: number;
  top_genre: string;
}

interface Album {
  album_id: number;
  title: string;
  artist: string;
  total_songs: number;
  created_at: Date;
}

interface AdminReportData {
  allArtists: Artist[];
  topArtists: Artist[];
  topSongs: Song[];
  allSongs: Song[];
  topGenres: GenreData[];
  monthlyStats: MonthlyStats[];
  totalPlayTime: number;
  totalSongsAdded: number;
  topGenre: string;
  monthlyTopSongs: { month: string; songs: Song[] }[];
  monthlyTopArtists: { month: string; artists: Artist[] }[];
  allAlbums: Album[];
}

export default function AdminReport() {
  const router = useRouter();
  const { role } = useUserStore();
  const [data, setData] = useState<AdminReportData | null>(null);
  const [filteredMonth, setFilteredMonth] = useState<string | null>(null);
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showAllListeners, setShowAllListeners] = useState(false); // ✅ NEW
  const [search, setSearch] = useState("");
  const [songSearch, setSongSearch] = useState("");
  const [sortOption, setSortOption] = useState("most_plays");
  const [filterGenre, setFilterGenre] = useState("");
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [songSortOption, setSongSortOption] = useState("most_plays");

  const sortMonths = (months: MonthlyStats[]) => {
    return [...months].sort((a, b) => {
      const [aYear, aMonth] = a.month.split("-").map(Number);
      const [bYear, bMonth] = b.month.split("-").map(Number);
      return aYear === bYear ? aMonth - bMonth : aYear - bYear;
    });
  };

  useEffect(() => {
    if (role !== "admin") router.push("/login");

    const fetchData = async () => {
      const res = await fetch("/api/admin/admin-report");
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, [role, router]);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center text-white text-xl animate-pulse">
        Loading Admin Report...
      </div>
    );
  }

  const periodLabel = filteredMonth
    ? formatMonth(filteredMonth)
    : formatMonth(data.monthlyStats.at(-1)!.month);

  const filteredStats = filteredMonth
    ? data.monthlyStats.find((m) => m.month === filteredMonth)
    : null;

  const artistList = showAllArtists
    ? data.allArtists
    : filteredMonth
    ? data.monthlyTopArtists.find((m) => m.month === filteredMonth)?.artists ??
      []
    : data.topArtists;

  const genres = Array.from(new Set(data.allArtists.map((a) => a.genre)));

  const filtered = artistList
    .filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.genre.toLowerCase().includes(search.toLowerCase())
    )
    .filter((a) => (filterGenre ? a.genre === filterGenre : true))
    .sort((a, b) => {
      if (sortOption === "a_z") return a.name.localeCompare(b.name);
      if (sortOption === "most_songs") return b.total_songs - a.total_songs;
      return b.play_count - a.play_count;
    });

  const songsToDisplay = showAllSongs
    ? data.allSongs ?? []
    : filteredMonth
    ? data.monthlyTopSongs.find((m) => m.month === filteredMonth)?.songs ?? []
    : data.topSongs ?? [];

  const filteredSongs = songsToDisplay.filter(
    (s) =>
      s.title.toLowerCase().includes(songSearch.toLowerCase()) ||
      s.genre.toLowerCase().includes(songSearch.toLowerCase())
  );

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    if (songSortOption === "a_z") return a.title.localeCompare(b.title);
    if (songSortOption === "genre") return a.genre.localeCompare(b.genre);
    return b.play_count - a.play_count;
  });

  const handleDeleteSong = async (song_id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this song?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/songs/${song_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete song");
      }

      setData((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          allSongs: prev.allSongs.filter((s) => s.song_id !== song_id),
          topSongs: prev.topSongs.filter((s) => s.song_id !== song_id),
          monthlyTopSongs: prev.monthlyTopSongs.map((month) => ({
            ...month,
            songs: month.songs.filter((s) => s.song_id !== song_id),
          })),
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const handleDeleteAlbum = async (album_id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this album? This will also remove all songs from the album."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/albums/${album_id}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete album");
      }

      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          allAlbums: prev.allAlbums.filter((a) => a.album_id !== album_id),
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 text-transparent bg-clip-text">
            Admin Music Report Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {" "}
            (For all users across selected month ⋆.˚✮🎧✮˚.⋆){" "}
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-800/50 p-4 rounded-xl">
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Filter by Month
            </label>
            <select
              onChange={(e) =>
                setFilteredMonth(
                  e.target.value === "all" ? null : e.target.value
                )
              }
              value={filteredMonth || "all"}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              <option value="all">All Months</option>
              {sortMonths(data.monthlyStats).map((m) => (
                <option key={m.month} value={m.month}>
                  {formatMonth(m.month)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={<FaClock />}
            title="Total Play Time"
            value={formatTime(
              filteredStats?.total_play_time || data.totalPlayTime
            )}
          />
          <StatCard
            icon={<FaMusic />}
            title="Songs Added"
            value={filteredStats?.total_songs_added || data.totalSongsAdded}
          />
          <StatCard
            icon={<FaChartBar />}
            title="Top Genre"
            value={filteredStats?.top_genre || data.topGenre}
          />
        </div>

        <SectionCard
          icon={<FaUsers />}
          title={`${showAllArtists ? "All Artists" : "Top Artists This Month"}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center bg-gray-700 rounded px-3 w-full md:w-60">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search artist or genre..."
                className="bg-transparent outline-none w-full text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="most_plays">Most Plays</option>
              <option value="most_songs">Most Songs</option>
              <option value="a_z">A - Z</option>
            </select>
          </div>
          <div className="text-sm text-right">
            Total: {data.allArtists.length} artists
            <button
              onClick={() => setShowAllArtists(!showAllArtists)}
              className="ml-4 underline text-blue-400 hover:text-blue-300"
            >
              {showAllArtists ? "View Top Artists" : "View All Artists"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Genre</th>
                  <th className="px-4 py-3">Followers</th>
                  <th className="px-4 py-3">Play Count</th>
                  <th className="px-4 py-3">Streaming Minutes</th>
                  <th className="px-4 py-3">Songs</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((artist) => (
                  <tr
                    key={artist.user_id}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3">{artist.name}</td>
                    <td className="px-4 py-3">{artist.genre}</td>
                    <td className="px-4 py-3">
                      {artist.followers.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {artist.play_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {artist.total_streaming_minutes}
                    </td>
                    <td className="px-4 py-3">{artist.total_songs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          icon={<FaPlay />}
          title={`${showAllSongs ? "All Songs" : "Top Songs"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm">Showing: {sortedSongs.length} songs</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-700 rounded px-3 w-full md:w-60">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search song or genre..."
                  className="bg-transparent outline-none w-full text-white"
                  value={songSearch}
                  onChange={(e) => setSongSearch(e.target.value)}
                />
              </div>
              <select
                value={songSortOption}
                onChange={(e) => setSongSortOption(e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
              >
                <option value="most_plays">Most Plays</option>
                <option value="a_z">A - Z Title</option>
                <option value="genre">Genre</option>
              </select>
              <button
                onClick={() => setShowAllSongs(!showAllSongs)}
                className="underline text-blue-400 hover:text-blue-300 text-sm"
              >
                {showAllSongs ? "View Top Songs" : "View All Songs"}
              </button>
            </div>
          </div>
          <ul className="divide-y divide-gray-700">
            {sortedSongs.map((song, i) => (
              <li
                key={song.song_id}
                className="py-2 flex justify-between items-center group hover:bg-gray-700/30"
              >
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium">
                    {i + 1}. {song.title}
                  </span>
                  <span className="text-sm text-gray-400">
                    {song.artist} • {song.genre}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    {song.play_count.toLocaleString()} plays
                  </div>
                  <button
                    onClick={() => handleDeleteSong(song.song_id)}
                    className="text-red-500 opacity-100 group-hover:opacity-75 transition-opacity p-3"
                    title="Delete song"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard icon={<FaChartBar />} title="Top Genres">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topGenres}>
              <defs>
                <linearGradient id="genreGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="genre" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #4B5563",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{
                  color: "#d1d5db",
                  fontSize: "0.875rem",
                }}
                itemStyle={{
                  color: "#fff",
                  fontSize: "0.875rem",
                }}
              />
              <Bar dataKey="count" fill="url(#genreGradient)" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard icon={<FaChartBar />} title="Streamed Hours by Month">
          <TopListenersTable
            period={periodLabel}
            showAllListeners={showAllListeners}
            setShowAllListeners={setShowAllListeners}
          />
        </SectionCard>

        <SectionCard icon={<FaClock />} title="New Sign‑ups by Role">
          <NewSignupsTable period={periodLabel} />
        </SectionCard>

        <SectionCard icon={<FaMusic />} title="All Albums">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-3">Title</th>
                  <th className="p-3">Artist</th>
                  <th className="p-3">Songs</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.allAlbums.map((album) => (
                  <tr
                    key={album.album_id}
                    className="border-b border-gray-700 hover:bg-gray-800/50"
                  >
                    <td className="p-3">{album.title}</td>
                    <td className="p-3">{album.artist}</td>
                    <td className="p-3">{album.total_songs}</td>
                    <td className="p-3">
                      {new Date(album.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteAlbum(album.album_id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon} {title}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}
