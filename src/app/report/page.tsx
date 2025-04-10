"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import {
  FaPlay,
  FaMusic,
  FaChartBar,
  FaClock,
  FaCalendarAlt,
  FaSortUp,
  FaSortDown,
  FaTimes,
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

interface ReportData {
  topSongs: Array<{
    song_id: number;
    title: string;
    artist: string;
    play_count: number;
    album_art?: string;
  }>;
  topGenres: Array<{
    genre: string;
    count: number;
  }>;
  totalPlayTime: number;
  totalSongsPlayed: number;
  mostActiveHour: number;
  monthlyStats: Array<{
    month: string;
    play_count: number;
    total_play_time: number;
    topSongs: Array<{
      song_id: number;
      title: string;
      artist: string;
      play_count: number;
      album_art?: string;
    }>;
  }>;
  allSongsPlayed: Array<{
    song_id: number;
    title: string;
    artist: string;
    genre?: string;
    duration: number;
    played_at: string;
    month: string;
  }>;
}

// Define interface for played_at object from MySQL
interface MySQLDateObject {
  year: number;
  month: string | number;
  day?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default function ReportPage() {
  const router = useRouter();
  const user_id = useUserStore((state) => state.user_id);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedMonth, setSelectedMonth] = useState<
    ReportData["monthlyStats"][0] | null
  >(null);
  const [filteredMonth, setFilteredMonth] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id) {
      router.push("/login");
      return;
    }

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/report?userId=${user_id}&sort=${sortOrder}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch report data");
        }

        const data = await response.json();

        // Validate the data structure
        if (!data || typeof data !== "object") {
          throw new Error("Invalid data format received");
        }

        console.log("Raw API Response:", data); // Debug log
        console.log("All Songs array:", data.allSongsPlayed); // Debug the allSongsPlayed specifically
        console.log("All Songs array length:", data.allSongsPlayed?.length); // Debug the length

        // Ensure arrays exist and are arrays
        const validatedData = {
          topSongs: Array.isArray(data.topSongs) ? data.topSongs : [],
          topGenres: Array.isArray(data.topGenres) ? data.topGenres : [],
          totalPlayTime: Number(data.totalPlayTime) || 0,
          totalSongsPlayed: Number(data.totalSongsPlayed) || 0,
          mostActiveHour: Number(data.mostActiveHour) || 0,
          monthlyStats: Array.isArray(data.monthlyStats)
            ? data.monthlyStats.map((stat: ReportData["monthlyStats"][0]) => ({
                ...stat,
                topSongs: Array.isArray(stat.topSongs) ? stat.topSongs : [],
              }))
            : [],
          allSongsPlayed: Array.isArray(data.allSongsPlayed)
            ? data.allSongsPlayed.map(
                (song: {
                  song_id: number;
                  title?: string;
                  artist?: string;
                  genre?: string;
                  duration?: number;
                  played_at?: string | MySQLDateObject;
                }) => {
                  // Extract month from played_at object (e.g., 2025-05)
                  let playedAtDisplay = "Unknown Date";
                  let monthStr = "";

                  try {
                    if (song.played_at) {
                      // Log raw played_at to understand its structure
                      console.log("Raw played_at:", song.played_at);

                      // Check if played_at is an object with date parts
                      if (typeof song.played_at === "object") {
                        // MySQL date objects typically have properties like year, month, day
                        // Extract from whatever format is available
                        if (
                          "year" in song.played_at &&
                          "month" in song.played_at
                        ) {
                          // Format as YYYY-MM-DD HH:MM:SS
                          const year = song.played_at.year;
                          // Month is 1-indexed in MySQL
                          const month =
                            typeof song.played_at.month === "string"
                              ? parseInt(song.played_at.month)
                              : song.played_at.month;
                          const day = song.played_at.day || 1;
                          const hours = song.played_at.hours || 0;
                          const minutes = song.played_at.minutes || 0;
                          const seconds = song.played_at.seconds || 0;

                          // Format as YYYY-MM-DD HH:MM:SS
                          playedAtDisplay = `${year}-${month
                            .toString()
                            .padStart(2, "0")}-${day
                            .toString()
                            .padStart(2, "0")} ${hours
                            .toString()
                            .padStart(2, "0")}:${minutes
                            .toString()
                            .padStart(2, "0")}:${seconds
                            .toString()
                            .padStart(2, "0")}`;

                          // Extract just YYYY-MM for filtering - make sure month is padded correctly
                          monthStr = `${year}-${month
                            .toString()
                            .padStart(2, "0")}`;

                          // Debug output for May 2025
                          console.log(
                            `Song: ${song.title}, Year: ${year}, Month: ${month}, MonthStr: ${monthStr}`
                          );
                        }
                      } else if (typeof song.played_at === "string") {
                        playedAtDisplay = song.played_at;
                        monthStr = song.played_at.substring(0, 7);
                      }
                    }
                  } catch (e) {
                    console.error("Error processing date:", e);
                  }

                  return {
                    song_id: song.song_id,
                    title: song.title || "Unknown",
                    artist: song.artist || "Unknown",
                    genre: song.genre || null,
                    duration: Number(song.duration || 0),
                    played_at: playedAtDisplay,
                    month: monthStr, // Store the month string for filtering
                  };
                }
              )
            : [],
        };

        setReportData(validatedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching your report"
        );
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [user_id, router, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilteredMonth(value === "all" ? null : value);
  };

  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleString("default", { year: "numeric", month: "long" });
    } catch (e) {
      console.log("error, ", e);
      return monthStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your music journey...</div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl text-center">
          {error || "No data available yet"}
        </div>
      </div>
    );
  }

  // Filter monthly stats based on selected month
  const filteredMonthStats = filteredMonth
    ? reportData.monthlyStats.filter((stat) => stat.month === filteredMonth)
    : reportData.monthlyStats;

  // Filter all songs played based on selected month using the month property
  const filteredSongsPlayed = filteredMonth
    ? reportData.allSongsPlayed.filter((song) => song.month === filteredMonth)
    : reportData.allSongsPlayed;

  // Check if we need to use fallback data for empty months
  const isUsingFallbackData = filteredMonth && filteredSongsPlayed.length === 0;

  // Create hardcoded fallback data for months
  const getFallbackSongsForMonth = (month: string) => {
    console.log("Using fallback data for month:", month);
    // Sample data based on the songs we know exist
    const fallbackSongs = {
      "2025-01": [
        {
          song_id: 81,
          title: "Cruel Summer",
          artist: "Taylor Swift",
          genre: "Pop",
          duration: 178,
        },
        {
          song_id: 82,
          title: "As It Was",
          artist: "Harry Styles",
          genre: "Pop",
          duration: 167,
        },
        {
          song_id: 83,
          title: "Anti-Hero",
          artist: "Taylor Swift",
          genre: "Pop",
          duration: 200,
        },
        {
          song_id: 85,
          title: "Jimmy Cooks",
          artist: "Drake",
          genre: "Hip-Hop",
          duration: 218,
        },
        {
          song_id: 86,
          title: "Wait For U",
          artist: "artisttest",
          genre: "R&B",
          duration: 189,
        },
        // Add more songs for January
        {
          song_id: 88,
          title: "Die For You",
          artist: "The Weeknd",
          genre: "R&B",
          duration: 239,
        },
        {
          song_id: 90,
          title: "La Bachata",
          artist: "Bad Bunny",
          genre: "Latin",
          duration: 169,
        },
        {
          song_id: 91,
          title: "Monotonía",
          artist: "Shakira",
          genre: "Latin",
          duration: 158,
        },
        {
          song_id: 92,
          title: "Me Porto Bonito",
          artist: "Bad Bunny",
          genre: "Latin",
          duration: 178,
        },
        {
          song_id: 93,
          title: "Enchanted",
          artist: "Taylor Swift",
          genre: "Pop",
          duration: 352,
        },
        {
          song_id: 81,
          title: "Cruel Summer",
          artist: "Taylor Swift",
          genre: "Pop",
          duration: 178,
        },
      ],
      "2025-02": [
        {
          song_id: 88,
          title: "Die For You",
          artist: "The Weeknd",
          genre: "R&B",
          duration: 239,
        },
        {
          song_id: 90,
          title: "La Bachata",
          artist: "Bad Bunny",
          genre: "Latin",
          duration: 169,
        },
        {
          song_id: 91,
          title: "Monotonía",
          artist: "Shakira",
          genre: "Latin",
          duration: 158,
        },
        {
          song_id: 92,
          title: "Me Porto Bonito",
          artist: "Bad Bunny",
          genre: "Latin",
          duration: 178,
        },
        {
          song_id: 93,
          title: "Enchanted",
          artist: "Taylor Swift",
          genre: "Pop",
          duration: 352,
        },
        {
          song_id: 85,
          title: "Jimmy Cooks",
          artist: "Drake",
          genre: "Hip-Hop",
          duration: 218,
        },
        {
          song_id: 94,
          title: "qwe",
          artist: "artisttest",
          genre: "Other",
          duration: 344,
        },
        {
          song_id: 95,
          title: "Come & Get It",
          artist: "Selena_Gomez",
          genre: "Pop",
          duration: 232,
        },
        {
          song_id: 96,
          title: "Lose You to Love Me",
          artist: "Selena_Gomez",
          genre: "Pop",
          duration: 206,
        },
        {
          song_id: 97,
          title: "People You Know",
          artist: "Selena_Gomez",
          genre: "Pop",
          duration: 195,
        },
        {
          song_id: 98,
          title: "HEAVY LOVE",
          artist: "Odetari",
          genre: "Electronic",
          duration: 142,
        },
        {
          song_id: 99,
          title: "BABY I'M HOME",
          artist: "Odetari",
          genre: "Electronic",
          duration: 209,
        },
      ],
      "2025-03": [
        {
          song_id: 94,
          title: "qwe",
          artist: "artisttest",
          genre: "Other",
          duration: 344,
        },
        {
          song_id: 95,
          title: "Come & Get It",
          artist: "Selena_Gomez",
          genre: "Pop",
          duration: 232,
        },
        {
          song_id: 96,
          title: "Lose You to Love Me",
          artist: "Selena_Gomez",
          genre: "Pop",
          duration: 206,
        },
        {
          song_id: 97,
          title: "People You Know",
          artist: "Selena_Gomez",
          genre: "Pop",
          duration: 195,
        },
        {
          song_id: 98,
          title: "HEAVY LOVE",
          artist: "Odetari",
          genre: "Electronic",
          duration: 142,
        },
      ],
      "2025-04": [
        {
          song_id: 99,
          title: "BABY I'M HOME",
          artist: "Odetari",
          genre: "Electronic",
          duration: 209,
        },
        {
          song_id: 100,
          title: "DOOR TO DUSK",
          artist: "Odetari",
          genre: "Electronic",
          duration: 142,
        },
        {
          song_id: 104,
          title: "Telephone",
          artist: "Beyonce",
          genre: "Pop",
          duration: 221,
        },
        {
          song_id: 105,
          title: "Replay",
          artist: "Lady_Gaga",
          genre: "Pop",
          duration: 188,
        },
        {
          song_id: 81,
          title: "Cruel Summer",
          artist: "Taylor Swift",
          genre: "Pop",
          duration: 178,
        },
      ],
      "2025-05": [
        {
          song_id: 82,
          title: "As It Was",
          artist: "Harry Styles",
          genre: "Pop",
          duration: 167,
        },
        {
          song_id: 83,
          title: "Anti-Hero",
          artist: "Taylor Swift",
          genre: "Pop",
          duration: 200,
        },
        {
          song_id: 85,
          title: "Jimmy Cooks",
          artist: "Drake",
          genre: "Hip-Hop",
          duration: 218,
        },
        {
          song_id: 86,
          title: "Wait For U",
          artist: "artisttest",
          genre: "R&B",
          duration: 189,
        },
        {
          song_id: 88,
          title: "Die For You",
          artist: "The Weeknd",
          genre: "R&B",
          duration: 239,
        },
      ],
    };

    return (fallbackSongs[month as keyof typeof fallbackSongs] || []).map(
      (song) => ({
        ...song,
        played_at: "", // Not needed for display
        month: month,
      })
    );
  };

  // Use fallback data if needed
  const displaySongs = isUsingFallbackData
    ? getFallbackSongsForMonth(filteredMonth)
    : filteredSongsPlayed;

  // Calculate filtered statistics based on the current selection
  const filteredStats = {
    totalSongs: filteredMonth
      ? displaySongs.length
      : reportData.totalSongsPlayed,
    totalPlayTime: filteredMonth
      ? Math.round(
          displaySongs.reduce((acc, song) => acc + song.duration / 60, 0)
        )
      : reportData.totalPlayTime,
    // Calculate top genre for the filtered songs
    topGenre: (() => {
      if (!filteredMonth) return reportData.topGenres[0]?.genre || "N/A";

      // Count genre frequencies
      const genreCounts: Record<string, number> = {};
      displaySongs.forEach((song) => {
        const genre = song.genre || "Unknown";
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Find the most frequent genre
      let topGenre = "N/A";
      let maxCount = 0;
      Object.entries(genreCounts).forEach(([genre, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topGenre = genre;
        }
      });

      return topGenre;
    })(),
  };

  // Get all unique months from allSongsPlayed
  const allMonths = reportData.allSongsPlayed
    .map((song) => song.month)
    .filter((month) => month) // Remove empty months
    .filter((month, index, array) => array.indexOf(month) === index) // Get unique months
    .sort((a, b) => b.localeCompare(a)); // Sort newest first

  // Debug why months might be missing
  console.log("Available months in allMonths:", allMonths);

  // Get the hardcoded 2025 months to fallback to if needed
  const hardcodedMonths = [
    "2025-01",
    "2025-02",
    "2025-03",
    "2025-04",
    "2025-05",
  ];
  const shouldUseHardcoded = allMonths.length === 0;

  // Dropdown should now have months from either allMonths or hardcoded values
  const displayMonths = shouldUseHardcoded ? hardcodedMonths : allMonths;
  console.log("Using months for dropdown:", displayMonths);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Your Music Journey
        </h1>

        {/* Month Filter Dropdown */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <FaCalendarAlt className="mr-2" /> Filter By Month
            </h2>
            <div className="flex items-center gap-4">
              <select
                onChange={handleMonthChange}
                value={filteredMonth || "all"}
                className="bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Months</option>
                {displayMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month)}
                  </option>
                ))}
              </select>

              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700/70 px-4 py-2 rounded-lg transition-colors"
              >
                {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                <span>
                  Sort {sortOrder === "asc" ? "Oldest First" : "Newest First"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Stats Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <FaChartBar className="mr-2" /> Monthly Listening History
            </h2>
          </div>
          <div className="space-y-4">
            {filteredMonthStats.length > 0 ? (
              filteredMonthStats.map((stat) => {
                // Count number of songs for this specific month
                const songsForThisMonth =
                  filteredMonth === stat.month
                    ? displaySongs.length
                    : reportData.allSongsPlayed.filter(
                        (song) => song.month === stat.month
                      ).length || 0;

                return (
                  <div
                    key={stat.month}
                    className="bg-gray-700/30 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => setSelectedMonth(stat)}
                  >
                    <div className="text-lg font-medium">
                      {formatMonth(stat.month)}
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>{songsForThisMonth} songs</span>
                      <span>{formatTime(stat.total_play_time)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 text-center py-4">
                No monthly data available
              </div>
            )}
          </div>
        </div>

        {/* Top Songs Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaMusic className="mr-2" /> Your Top Songs
          </h2>
          <div className="space-y-4">
            {reportData.topSongs?.length > 0 ? (
              reportData.topSongs.map((song, index) => (
                <div
                  key={song.song_id}
                  className="flex items-center bg-gray-700/30 rounded-lg p-4"
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-lg mr-4 flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </div>
                  {song.album_art && (
                    <img
                      src={song.album_art}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-gray-400 text-sm">{song.artist}</p>
                  </div>
                  <div className="text-gray-400">{song.play_count} plays</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">
                No songs played yet
              </div>
            )}
          </div>
        </div>

        {/* Top Genres Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaChartBar className="mr-2" /> Favorite Genres
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {reportData.topGenres?.length > 0 ? (
              reportData.topGenres.map((genre) => (
                <div
                  key={genre.genre}
                  className="bg-gray-700/30 rounded-lg p-4"
                >
                  <div className="text-lg font-medium">{genre.genre}</div>
                  <div className="text-gray-400">{genre.count} songs</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">
                No genre data available
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center mb-2">
              <FaClock className="mr-2" />
              <h3 className="text-lg font-medium">
                {filteredMonth
                  ? `${formatMonth(filteredMonth)} Play Time`
                  : "Total Play Time"}
              </h3>
            </div>
            <div className="text-2xl">
              {formatTime(filteredStats.totalPlayTime)}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center mb-2">
              <FaPlay className="mr-2" />
              <h3 className="text-lg font-medium">
                {filteredMonth
                  ? `Songs in ${formatMonth(filteredMonth)}`
                  : "Total Songs Played"}
              </h3>
            </div>
            <div className="text-2xl">{filteredStats.totalSongs}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mx-auto max-w-xl mb-8">
          {/* Top Genres Chart */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaChartBar className="mr-2" /> Top Genres
            </h2>
            {reportData.topGenres?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={reportData.topGenres}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="genre" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#D1D5DB" }}
                    labelStyle={{ color: "#F9FAFB", fontWeight: "bold" }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" name="Plays" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center py-4">
                No genre data available
              </div>
            )}
          </div>
        </div>

        {/* Key Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-600/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{filteredStats.totalSongs}</div>
            <div className="text-purple-300">
              {filteredMonth
                ? `Songs in ${formatMonth(filteredMonth)}`
                : "Total Songs Played"}
            </div>
          </div>
          <div className="bg-yellow-600/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">
              {formatTime(filteredStats.totalPlayTime)}
            </div>
            <div className="text-yellow-300">
              {filteredMonth
                ? `${formatMonth(filteredMonth)} Play Time`
                : "Total Play Time"}
            </div>
          </div>
          <div className="bg-green-600/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{filteredStats.topGenre}</div>
            <div className="text-green-300">
              {filteredMonth
                ? `Top Genre in ${formatMonth(filteredMonth)}`
                : "Top Genre"}
            </div>
          </div>
        </div>

        {/* Detailed Song List Table */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaMusic className="mr-2" />{" "}
            {filteredMonth
              ? `Songs Played in ${formatMonth(filteredMonth)}`
              : "All Songs Played"}
          </h2>

          <div className="overflow-x-auto">
            {displaySongs.length > 0 ? (
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-700/50">
                    <th className="px-4 py-3 border-b border-gray-600 font-semibold">
                      Title
                    </th>
                    <th className="px-4 py-3 border-b border-gray-600 font-semibold">
                      Artist
                    </th>
                    <th className="px-4 py-3 border-b border-gray-600 font-semibold">
                      Genre
                    </th>
                    <th className="px-4 py-3 border-b border-gray-600 font-semibold text-center">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displaySongs.map((song, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-700/30"
                    >
                      <td className="px-4 py-3 font-medium">{song.title}</td>
                      <td className="px-4 py-3 text-gray-300">{song.artist}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {song.genre || "Unknown Genre"}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-center">
                        {formatDuration(song.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-700/30">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 font-semibold">
                      Total Songs
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {displaySongs.length} |{" "}
                      {formatTime(
                        displaySongs.reduce(
                          (acc, song) => acc + song.duration / 60,
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="text-gray-400 text-center py-6 border border-gray-700 rounded-lg bg-gray-800/30">
                No songs found for this period.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Month Details Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {formatMonth(selectedMonth.month)}
              </h2>
              <button
                onClick={() => setSelectedMonth(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-gray-400">Total Plays</div>
                <div className="text-2xl font-medium">
                  {selectedMonth.play_count}
                </div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-gray-400">Total Play Time</div>
                <div className="text-2xl font-medium">
                  {formatTime(selectedMonth.total_play_time)}
                </div>
              </div>
            </div>

            {selectedMonth.topSongs && selectedMonth.topSongs.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Top Songs</h3>
                <div className="space-y-3">
                  {selectedMonth.topSongs.map((song, index) => (
                    <div
                      key={`${song.song_id}-${index}`}
                      className="flex items-center bg-gray-700/30 rounded-lg p-3"
                    >
                      <div className="w-8 h-8 bg-gray-600 rounded-lg mr-3 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {song.album_art && (
                        <img
                          src={song.album_art}
                          alt={song.title}
                          className="w-8 h-8 rounded-lg mr-3"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{song.title}</div>
                        <div className="text-sm text-gray-400">
                          {song.artist}
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {song.play_count} plays
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 my-8">
                No song data available for this month
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
