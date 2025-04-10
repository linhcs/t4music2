"use client";

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { FaPlay, FaMusic, FaChartBar, FaClock, FaHeart, FaSortUp, FaSortDown, FaTimes, FaCalendarAlt } from 'react-icons/fa';

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
}

export default function ReportPage() {
  const router = useRouter();
  const user_id = useUserStore((state) => state.user_id);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMonth, setSelectedMonth] = useState<ReportData['monthlyStats'][0] | null>(null);
  const [filteredMonth, setFilteredMonth] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id) {
      router.push('/login');
      return;
    }

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/report?userId=${user_id}&sort=${sortOrder}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch report data');
        }

        const data = await response.json();

        // Validate the data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format received');
        }

        console.log('API Response:', data); // Debug log

        // Ensure arrays exist and are arrays
        const validatedData = {
          topSongs: Array.isArray(data.topSongs) ? data.topSongs : [],
          topGenres: Array.isArray(data.topGenres) ? data.topGenres : [],
          totalPlayTime: Number(data.totalPlayTime) || 0,
          totalSongsPlayed: Number(data.totalSongsPlayed) || 0,
          mostActiveHour: Number(data.mostActiveHour) || 0,
          monthlyStats: Array.isArray(data.monthlyStats) ? data.monthlyStats.map((stat: ReportData['monthlyStats'][0]) => ({
            ...stat,
            topSongs: Array.isArray(stat.topSongs) ? stat.topSongs : []
          })) : []
        };

        setReportData(validatedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching your report');
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [user_id, router, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilteredMonth(value === 'all' ? null : value);
  };

  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleString('default', { year: 'numeric', month: 'long' });
    } catch (e) {
      console.log('error, ', e);
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
          {error || 'No data available yet'}
        </div>
      </div>
    );
  }

  // Filter monthly stats based on selected month
  const filteredMonthStats = filteredMonth 
    ? reportData.monthlyStats.filter(stat => stat.month === filteredMonth)
    : reportData.monthlyStats;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Music Journey</h1>
        
        {/* Month Filter Dropdown */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <FaCalendarAlt className="mr-2" /> Filter By Month
            </h2>
            <div className="flex items-center gap-4">
              <select 
                onChange={handleMonthChange}
                value={filteredMonth || 'all'}
                className="bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Months</option>
                {reportData.monthlyStats.map(stat => (
                  <option key={stat.month} value={stat.month}>
                    {formatMonth(stat.month)}
                  </option>
                ))}
              </select>
              
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700/70 px-4 py-2 rounded-lg transition-colors"
              >
                {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                <span>Sort {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
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
              filteredMonthStats.map((stat) => (
                <div 
                  key={stat.month} 
                  className="bg-gray-700/30 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  onClick={() => setSelectedMonth(stat)}
                >
                  <div className="text-lg font-medium">
                    {formatMonth(stat.month)}
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{stat.play_count} plays</span>
                    <span>{formatTime(stat.total_play_time)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">No monthly data available</div>
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
                <div key={song.song_id} className="flex items-center bg-gray-700/30 rounded-lg p-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg mr-4 flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </div>
                  {song.album_art && (
                    <img src={song.album_art} alt={song.title} className="w-12 h-12 rounded-lg mr-4" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-gray-400 text-sm">{song.artist}</p>
                  </div>
                  <div className="text-gray-400">
                    {song.play_count} plays
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">No songs played yet</div>
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
                <div key={genre.genre} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-lg font-medium">{genre.genre}</div>
                  <div className="text-gray-400">{genre.count} songs</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">No genre data available</div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center mb-2">
              <FaClock className="mr-2" />
              <h3 className="text-lg font-medium">Total Play Time</h3>
            </div>
            <div className="text-2xl">{formatTime(reportData.totalPlayTime || 0)}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center mb-2">
              <FaPlay className="mr-2" />
              <h3 className="text-lg font-medium">Total Songs Played</h3>
            </div>
            <div className="text-2xl">{reportData.totalSongsPlayed || 0}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center mb-2">
              <FaHeart className="mr-2" />
              <h3 className="text-lg font-medium">Most Active Hour</h3>
            </div>
            <div className="text-2xl">{reportData.mostActiveHour || 0}:00</div>
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
                <div className="text-2xl font-medium">{selectedMonth.play_count}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-gray-400">Total Play Time</div>
                <div className="text-2xl font-medium">{formatTime(selectedMonth.total_play_time)}</div>
              </div>
            </div>

            {selectedMonth.topSongs && selectedMonth.topSongs.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Top Songs</h3>
                <div className="space-y-3">
                  {selectedMonth.topSongs.map((song, index) => (
                    <div key={`${song.song_id}-${index}`} className="flex items-center bg-gray-700/30 rounded-lg p-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-lg mr-3 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {song.album_art && (
                        <img src={song.album_art} alt={song.title} className="w-8 h-8 rounded-lg mr-3" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{song.title}</div>
                        <div className="text-sm text-gray-400">{song.artist}</div>
                      </div>
                      <div className="text-gray-400">{song.play_count} plays</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 my-8">No song data available for this month</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 