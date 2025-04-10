import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Stats {
  total_songs_played: number;
  total_play_time: number;
}

interface MostActiveHour {
  hour: number;
  count: number;
}

interface TableCheck {
  count: number;
}

// Helper function to convert BigInt to Number
const serializeBigInt = (obj: unknown): unknown => {
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
    );
  }
  
  return obj;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if song_plays table exists
    const tableExists = await prisma.$queryRaw<TableCheck[]>`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'db-music'
      AND table_name = 'song_plays'
    `;

    if (!tableExists || !tableExists[0]?.count) {
      return NextResponse.json({
        topSongs: [],
        topGenres: [],
        totalPlayTime: 0,
        totalSongsPlayed: 0,
        mostActiveHour: 0
      });
    }

    // Get top songs
    const topSongs = await prisma.$queryRaw`
      SELECT 
        s.song_id,
        s.title,
        u.username as artist,
        COUNT(*) as play_count,
        a.album_art
      FROM song_plays sp
      JOIN songs s ON sp.song_id = s.song_id
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN album a ON s.album_id = a.album_id
      WHERE sp.user_id = ${Number(userId)}
      GROUP BY s.song_id, s.title, u.username, a.album_art
      ORDER BY play_count DESC
      LIMIT 10
    `;

    // Get top genres
    const topGenres = await prisma.$queryRaw`
      SELECT 
        s.genre,
        COUNT(*) as count
      FROM song_plays sp
      JOIN songs s ON sp.song_id = s.song_id
      WHERE sp.user_id = ${Number(userId)}
      AND s.genre IS NOT NULL
      GROUP BY s.genre
      ORDER BY count DESC
      LIMIT 5
    `;

    // Get total play time and songs played
    const stats = await prisma.$queryRaw<Stats[]>`
      SELECT 
        COUNT(*) as total_songs_played,
        COALESCE(SUM(s.duration), 0) as total_play_time
      FROM song_plays sp
      JOIN songs s ON sp.song_id = s.song_id
      WHERE sp.user_id = ${Number(userId)}
    `;

    // Get most active hour
    const mostActiveHour = await prisma.$queryRaw<MostActiveHour[]>`
      SELECT 
        HOUR(played_at) as hour,
        COUNT(*) as count
      FROM song_plays
      WHERE user_id = ${Number(userId)}
      GROUP BY HOUR(played_at)
      ORDER BY count DESC
      LIMIT 1
    `;

    // Ensure we have valid data and convert BigInts to Numbers
    const reportData = serializeBigInt({
      topSongs: topSongs || [],
      topGenres: topGenres || [],
      totalPlayTime: stats[0]?.total_play_time || 0,
      totalSongsPlayed: stats[0]?.total_songs_played || 0,
      mostActiveHour: mostActiveHour[0]?.hour || 0
    });

    return NextResponse.json(reportData);
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