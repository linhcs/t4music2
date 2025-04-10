import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Helper function to convert BigInt to Number
const convertBigIntToNumber = (obj: unknown): unknown => {
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntToNumber(value)])
    );
  }
  return obj;
};

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

interface SongPlay {
  song_id: number;
  play_count: number;
}

interface SongDetail {
  song_id: number;
  title: string;
  users: {
    username: string;
  };
  album: {
    album_art: string | null;
  } | null;
}

interface GenreCount {
  genre: string | null;
  count: number;
}

interface MonthSongPlay {
  song_id: number;
  play_count: number;
  month: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const period = url.searchParams.get('period') || 'all';
    const sort = url.searchParams.get('sort') || 'desc'; // 'asc' or 'desc'
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
      // Get user's account creation date
      const user = await prisma.users.findUnique({
        where: { user_id: Number(userId) },
        select: { created_at: true }
      });
  
      const accountCreationDate = user?.created_at || new Date(0);
      console.log(`[Report API] User ID: ${userId}, Account Creation Date: ${accountCreationDate.toISOString()}`);
  
      // Get date range based on period
      const getDateRange = () => {
        const now = new Date();
        switch (period) {
          case 'year':
            return new Date(now.getFullYear(), 0, 1);
          case 'month':
            return new Date(now.getFullYear(), now.getMonth(), 1);
          case 'week':
            return new Date(now.setDate(now.getDate() - 7));
          default:
            return accountCreationDate; // Use account creation date for 'all'
        }
      };
  
      const startDate = getDateRange();
  
      // Get top songs
      const topSongs = await prisma.$queryRaw<SongPlay[]>`
        SELECT song_id, COUNT(*) as play_count
        FROM song_plays
        WHERE user_id = ${Number(userId)}
          AND played_at >= ${startDate}
        GROUP BY song_id
        ORDER BY play_count DESC
        LIMIT 10
      `;
  
      // Get song details for the top songs
      const songDetails = await prisma.songs.findMany({
        where: {
          song_id: {
            in: topSongs.length > 0 ? topSongs.map((song: SongPlay) => song.song_id) : [0]
          }
        },
        select: {
          song_id: true,
          title: true,
          users: {
            select: {
              username: true
            }
          },
          album: {
            select: {
              album_art: true
            }
          }
        }
      }) as unknown as SongDetail[];
  
      // Get top genres
      const topGenres = await prisma.$queryRaw<GenreCount[]>`
        SELECT s.genre, COUNT(*) as count
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE sp.user_id = ${Number(userId)}
          AND sp.played_at >= ${startDate}
          AND s.genre IS NOT NULL
        GROUP BY s.genre
        ORDER BY count DESC
        LIMIT 5
      `;
  
      // Get total play time and songs played
      const stats = await prisma.$queryRaw<{ total_play_time: number; total_songs_played: number }[]>`
        SELECT 
          COUNT(*) as total_songs_played,
          COALESCE(SUM(s.duration), 0) as total_play_time
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE sp.user_id = ${Number(userId)}
      `;
  
      // Get most active hour
      const mostActiveHour = await prisma.$queryRaw<{ hour: number; count: number }[]>`
        SELECT 
          HOUR(played_at) as hour,
          COUNT(*) as count
        FROM song_plays
        WHERE user_id = ${Number(userId)}
          AND played_at >= ${startDate}
        GROUP BY HOUR(played_at)
        ORDER BY count DESC
        LIMIT 1
      `;
  
      // Get monthly stats
      const monthlyStats = await prisma.$queryRaw<Array<{
        month: string;
        play_count: number;
        total_play_time: number;
      }>>`
        SELECT 
          DATE_FORMAT(sp.played_at, '%Y-%m') as month,
          COUNT(*) as play_count,
          COALESCE(SUM(s.duration), 0) as total_play_time
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE sp.user_id = ${Number(userId)}
        GROUP BY DATE_FORMAT(sp.played_at, '%Y-%m')
        ORDER BY month ${sort === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`}
      `;
  
      // Get top 5 songs per month - simplified query without WITH or ROW_NUMBER
      const topSongsPerMonth = await prisma.$queryRaw<MonthSongPlay[]>`
        SELECT 
          DATE_FORMAT(sp.played_at, '%Y-%m') as month,
          sp.song_id,
          COUNT(*) as play_count
        FROM song_plays sp
        WHERE sp.user_id = ${Number(userId)}
        GROUP BY DATE_FORMAT(sp.played_at, '%Y-%m'), sp.song_id
        ORDER BY month ${sort === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`}, play_count DESC
      `;
  
      // Create a map to get top 5 songs per month
      const monthTopSongsMap = new Map<string, MonthSongPlay[]>();
      
      // Group songs by month
      topSongsPerMonth.forEach(song => {
        if (!monthTopSongsMap.has(song.month)) {
          monthTopSongsMap.set(song.month, []);
        }
        const monthSongs = monthTopSongsMap.get(song.month);
        // Only add song if we have less than 5 for this month
        if (monthSongs && monthSongs.length < 5) {
          monthSongs.push(song);
        }
      });
      
      // Get all unique song IDs from top songs per month
      const allSongIds = [...new Set(
        Array.from(monthTopSongsMap.values())
          .flat()
          .map(song => song.song_id)
      )];
      
      // Get song details for all songs in monthly stats
      const allSongDetails = await prisma.songs.findMany({
        where: {
          song_id: {
            in: allSongIds.length > 0 ? allSongIds : [0] // Prevent empty IN clause
          }
        },
        select: {
          song_id: true,
          title: true,
          users: {
            select: {
              username: true
            }
          },
          album: {
            select: {
              album_art: true
            }
          }
        }
      }) as unknown as SongDetail[];
  
      // Process monthly stats with top songs
      const monthlyStatsWithSongs = monthlyStats.map(month => {
        // Get songs for this month
        const monthSongs = monthTopSongsMap.get(month.month) || [];
        
        // Format the songs with details
        const topSongs = monthSongs.map(song => {
          const songDetail = allSongDetails.find(detail => detail.song_id === song.song_id);
          return {
            song_id: song.song_id,
            title: songDetail?.title || 'Unknown Song',
            artist: songDetail?.users?.username || 'Unknown Artist',
            play_count: Number(song.play_count),
            album_art: songDetail?.album?.album_art || undefined
          };
        });
  
        return {
          month: month.month,
          play_count: Number(month.play_count),
          total_play_time: Math.round(Number(month.total_play_time) / 60),
          topSongs: topSongs
        };
      });
  
      // Format the response
      const reportData: ReportData = {
        topSongs: topSongs.map(play => {
          const songDetail = songDetails.find(detail => detail.song_id === play.song_id);
          return {
            song_id: play.song_id,
            title: songDetail?.title || 'Unknown Song',
            artist: songDetail?.users?.username || 'Unknown Artist',
            play_count: Number(play.play_count),
            album_art: songDetail?.album?.album_art || undefined
          };
        }),
        topGenres: topGenres.map(genre => ({
          genre: genre.genre || 'Unknown Genre',
          count: Number(genre.count)
        })),
        totalPlayTime: Math.round((stats[0]?.total_play_time || 0) / 60),
        totalSongsPlayed: Number(stats[0]?.total_songs_played || 0),
        mostActiveHour: Number(mostActiveHour[0]?.hour || 0),
        monthlyStats: monthlyStatsWithSongs
      };
  
      // Convert any BigInt values to numbers before sending the response
      const convertedData = convertBigIntToNumber(reportData);
  
      return NextResponse.json(convertedData);
    } catch (error) {
      console.error('Database query error:', error);
      // Fallback response with empty data
      return NextResponse.json({
        topSongs: [],
        topGenres: [],
        totalPlayTime: 0,
        totalSongsPlayed: 0,
        mostActiveHour: 0,
        monthlyStats: []
      });
    }
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 