'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import {
  FaPlay, FaMusic, FaChartBar, FaClock,
  FaHeart, FaSortUp, FaSortDown, FaUserPlus, FaUpload,
  FaDatabase
} from 'react-icons/fa';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

interface Song {
  song_id: number;
  title: string;
  artist: string;
  play_count: number;
  album_art?: string;
}

interface Genre {
  genre: string;
  count: number;
}

interface MonthlyStat {
  month: string;
  play_count: number;
  total_play_time: number;
  topSongs: Song[];
}

interface ArtistStats {
  songs_uploaded: number;
  total_plays: number;
  followers_count: number;
}

interface ReportData {
  topSongs: Song[];
  topGenres: Genre[];
  totalPlayTime: number;
  totalSongsPlayed: number;
  mostActiveHour: number;
  monthlyStats: MonthlyStat[];
  artistStats: ArtistStats;
  artistSongs: Song[];
}

export default function ArtistReport() {
  const router = useRouter();
  const user_id = useUserStore((state) => state.user_id);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredMonth, setFilteredMonth] = useState<string | null>(null);

  // Filter to only include Jan-Apr 2025 data
  const filterJanToApr2025 = (data: MonthlyStat[]) => {
    return data.filter(stat => {
      const [year, month] = stat.month.split('-');
      return year === '2025' && ['01', '02', '03', '04'].includes(month);
    });
  };

  useEffect(() => {
    if (!user_id) {
      router.push('/login');
      return;
    }

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/artist-report?userId=${user_id}&period=${filteredMonth || 'all'}&sort=${sortOrder}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }

        const data = await response.json();
        setReportData(data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [user_id, router, sortOrder, filteredMonth]);

  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilteredMonth(e.target.value === 'all' ? null : e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading your artist report...</div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl text-center p-4 bg-red-900/30 rounded-lg">
          {error || 'No data available'}
        </div>
      </div>
    );
  }

  // Filter monthly stats to only Jan-Apr 2025
  const filteredMonthlyStats = filterJanToApr2025(reportData.monthlyStats);
  const currentMonthData = filteredMonth 
    ? filteredMonthlyStats.find(stat => stat.month === filteredMonth)
    : null;

  const displayedSongs = filteredMonth 
    ? currentMonthData?.topSongs || []
    : reportData.topSongs;

  const displayedGenres = reportData.topGenres;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Artist Analytics Dashboard
          </h1>
          <p className="text-gray-400">Showing data from January 2025 to April 2025</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-800/50 p-4 rounded-xl">
          <div className="w-full md:w-auto">
            <label className="block text-sm text-gray-400 mb-1">Filter by Month</label>
            <select
              onChange={handleMonthChange}
              value={filteredMonth || 'all'}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All (Jan-Apr 2025)</option>
              {filteredMonthlyStats.map(stat => (
                <option key={stat.month} value={stat.month}>
                  {formatMonth(stat.month)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
            <span>Sort {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<FaUpload />}
            title="Songs Uploaded"
            value={currentMonthData
              ? currentMonthData.topSongs.length
              : filteredMonthlyStats.reduce((sum, stat) => sum + stat.topSongs.length, 0)}
          />
          <StatCard
            icon={<FaPlay />}
            title="Total Plays"
            value={currentMonthData
              ? currentMonthData.play_count.toLocaleString()
              : filteredMonthlyStats.reduce((sum, stat) => sum + stat.play_count, 0).toLocaleString()}
          />
          <StatCard
            icon={<FaUserPlus />}
            title="Followers"
            value={reportData.artistStats.followers_count.toLocaleString()}
          />
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaDatabase /> {filteredMonth ? formatMonth(filteredMonth) : 'Jan-Apr 2025'} Data
          </h2>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Songs</h3>
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Artist</th>
                  <th className="px-4 py-3">Plays</th>
                </tr>
              </thead>
              <tbody>
                {displayedSongs.map(song => (
                  <tr key={song.song_id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="px-4 py-3">{song.title}</td>
                    <td className="px-4 py-3">{song.artist}</td>
                    <td className="px-4 py-3">{song.play_count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Monthly Stats</h3>
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Plays</th>
                  <th className="px-4 py-3">Play Time</th>
                </tr>
              </thead>
              <tbody>
                {(filteredMonth
                  ? currentMonthData ? [currentMonthData] : []
                  : filteredMonthlyStats
                ).map(stat => (
                  <tr key={stat.month} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="px-4 py-3">{formatMonth(stat.month)}</td>
                    <td className="px-4 py-3">{stat.play_count.toLocaleString()}</td>
                    <td className="px-4 py-3">{formatDuration(stat.total_play_time * 60)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard
            icon={<FaMusic />}
            title="Top Songs"
          >
            {displayedSongs.length > 0 ? (
              <div className="space-y-3">
                {displayedSongs.map((song, index) => (
                  <SongItem
                    key={song.song_id}
                    song={song}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No song data available" />
            )}
          </SectionCard>

          <SectionCard
            icon={<FaChartBar />}
            title="Top Genres"
          >
            {displayedGenres.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {displayedGenres.map(genre => (
                  <div key={genre.genre} className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="font-medium">{genre.genre}</div>
                    <div className="text-gray-400 text-sm">{genre.count} plays</div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No genre data available" />
            )}
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<FaClock />}
            title="Total Play Time"
            value={formatDuration(reportData.totalPlayTime * 60)}
            small
          />
          <StatCard
            icon={<FaPlay />}
            title="Total Songs Played"
            value={reportData.totalSongsPlayed.toLocaleString()}
            small
          />
          <StatCard
            icon={<FaHeart />}
            title="Peak Listening Hour"
            value={`${reportData.mostActiveHour}:00`}
            small
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  small = false,
  noIcon = false
}: {
  icon?: React.ReactNode;
  title: string;
  value: string | number;
  small?: boolean;
  noIcon?: boolean;
}) {
  return (
    <div className={`bg-gray-800/50 ${small ? 'p-3' : 'p-4'} rounded-xl`}>
      <div className={`flex ${noIcon ? '' : 'items-center'} gap-2 ${small ? 'mb-1' : 'mb-2'}`}>
        {!noIcon && icon}
        <div className={`${small ? 'text-sm' : 'text-base'} text-gray-400`}>{title}</div>
      </div>
      <div className={`${small ? 'text-xl' : 'text-2xl'} font-semibold`}>{value}</div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function SongItem({
  song,
  index,
  showAlbumArt = false
}: {
  song: Song;
  index: number;
  showAlbumArt?: boolean;
}) {
  return (
    <div className="flex items-center bg-gray-800/30 hover:bg-gray-700/50 rounded-lg p-3 transition-colors">
      <div className="w-8 h-8 bg-gray-700 rounded-lg mr-3 flex items-center justify-center text-sm font-bold">
        {index + 1}
      </div>
      {showAlbumArt && song.album_art && (
        <div className="relative w-10 h-10 rounded-lg mr-3 overflow-hidden">
          <Image
            src={song.album_art}
            alt={`Album art for ${song.title}`}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{song.title}</div>
        <div className="text-sm text-gray-400 truncate">{song.artist}</div>
      </div>
      <div className="text-gray-400 whitespace-nowrap ml-2">
        {song.play_count.toLocaleString()} plays
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-gray-500 py-8">
      {message}
    </div>
  );
}