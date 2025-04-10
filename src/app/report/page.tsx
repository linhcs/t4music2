"use client";

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { FaPlay, FaMusic, FaChartBar, FaClock, FaHeart } from 'react-icons/fa';

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
}

export default function ReportPage() {
  const router = useRouter();
  const user_id = useUserStore((state) => state.user_id);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id) {
      router.push('/login');
      return;
    }

    const fetchReportData = async () => {
      try {
        const response = await fetch(`/api/report?userId=${user_id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch report data');
        }

        // Validate the data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format received');
        }

        // Ensure arrays exist and are arrays
        const validatedData = {
          topSongs: Array.isArray(data.topSongs) ? data.topSongs : [],
          topGenres: Array.isArray(data.topGenres) ? data.topGenres : [],
          totalPlayTime: Number(data.totalPlayTime) || 0,
          totalSongsPlayed: Number(data.totalSongsPlayed) || 0,
          mostActiveHour: Number(data.mostActiveHour) || 0
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
  }, [user_id, router]);

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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Music Journey</h1>
        
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
    </div>
  );
} 