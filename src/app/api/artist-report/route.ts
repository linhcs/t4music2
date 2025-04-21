import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const convertBigIntToNumber = (obj: unknown): unknown => {
  if (typeof obj === 'bigint') return Number(obj);
  if (Array.isArray(obj)) return obj.map(convertBigIntToNumber);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntToNumber(value)])
    );
  }
  return obj;
}

interface SongPlay {
  song_id: number;
  play_count: bigint; 
}

interface GenreCount {
  genre: string | null;
  count: bigint;
}

interface MonthSongPlay {
  song_id: number;
  play_count: bigint;
  month: string;
}

interface ArtistStats {
  songs_uploaded: bigint;
  total_plays: bigint;
  followers_count: bigint;
}

interface ArtistSong {
  song_id: number;
  title: string;
  play_count: bigint;
  album_art: string | null;
}

interface ReportData {
  topSongs: {
    song_id: number;
    title: string;
    artist: string;
    play_count: number;
    album_art?: string;
  }[];
  topGenres: {
    genre: string;
    count: number;
  }[];
  totalPlayTime: number;
  totalSongsPlayed: number;
  mostActiveHour: number;
  monthlyStats: {
    month: string;
    play_count: number;
    total_play_time: number;
    topSongs: {
      song_id: number;
      title: string;
      artist: string;
      play_count: number;
      album_art?: string;
    }[];
  }[];
  artistStats: {
    songs_uploaded: number;
    total_plays: number;
    followers_count: number;
  };
  artistSongs: {
    song_id: number;
    title: string;
    play_count: number;
    album_art?: string;
  }[];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const period = url.searchParams.get('period') || 'all';
    const sort = url.searchParams.get('sort') || 'desc';
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const numericUserId = Number(userId);

    try {
      const user = await prisma.users.findUnique({
        where: { user_id: numericUserId },
        select: { created_at: true }
      });
  
      const accountCreationDate = user?.created_at || new Date(0);
  
      const getDateRange = () => {
        const now = new Date();
        switch (period) {
          case 'year': return new Date(now.getFullYear(), 0, 1);
          case 'month': return new Date(now.getFullYear(), now.getMonth(), 1);
          case 'week': return new Date(now.setDate(now.getDate() - 7));
          default: return accountCreationDate;
        }
      };
  
      const startDate = getDateRange();

      const topSongs = await prisma.$queryRaw<Array<{
        song_id: number;
        play_count: bigint;
        title: string;
        artist: string;
        album_art: string | null;
      }>>`
        SELECT 
          s.song_id, 
          COUNT(*) as play_count,
          s.title,
          u.username as artist,
          a.album_art
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        JOIN users u ON s.user_id = u.user_id
        LEFT JOIN album a ON s.album_id = a.album_id
        WHERE s.user_id = ${numericUserId}
          AND sp.played_at >= ${startDate}
        GROUP BY s.song_id, s.title, u.username, a.album_art
        ORDER BY play_count DESC
        LIMIT 10
      `;

      //top genres
      const topGenres = await prisma.$queryRaw<GenreCount[]>`
        SELECT 
          COALESCE(s.genre, 'Unknown') as genre, 
          COUNT(*) as count
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE s.user_id = ${numericUserId}
          AND sp.played_at >= ${startDate}
        GROUP BY s.genre
        ORDER BY count DESC
        LIMIT 5
      `;

      const stats = await prisma.$queryRaw<{ total_play_time: number; total_songs_played: bigint }[]>`
        SELECT 
          COUNT(DISTINCT sp.id) as total_songs_played,
          COALESCE(SUM(s.duration)/60, 0) as total_play_time
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE s.user_id = ${numericUserId}
          AND sp.played_at >= ${startDate}
      `;

      const mostActiveHour = await prisma.$queryRaw<{ hour: number; count: bigint }[]>`
        SELECT 
          HOUR(sp.played_at) as hour,
          COUNT(*) as count
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE s.user_id = ${numericUserId}
          AND sp.played_at >= ${startDate}
        GROUP BY HOUR(sp.played_at)
        ORDER BY count DESC
        LIMIT 1
      `;

      const monthlyStats = await prisma.$queryRaw<Array<{
        month: string;
        play_count: bigint;
        total_play_time: number;
      }>>`
        SELECT 
          DATE_FORMAT(sp.played_at, '%Y-%m') as month,
          COUNT(*) as play_count,
          COALESCE(SUM(s.duration)/60, 0) as total_play_time
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE s.user_id = ${numericUserId}
        GROUP BY DATE_FORMAT(sp.played_at, '%Y-%m')
        ORDER BY month ${sort === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`}
      `;

      //top songs by month
      const topSongsPerMonth = await prisma.$queryRaw<MonthSongPlay[]>`
        SELECT 
          DATE_FORMAT(sp.played_at, '%Y-%m') as month,
          s.song_id,
          COUNT(*) as play_count
        FROM song_plays sp
        JOIN songs s ON sp.song_id = s.song_id
        WHERE s.user_id = ${numericUserId}
        GROUP BY DATE_FORMAT(sp.played_at, '%Y-%m'), s.song_id
        ORDER BY month ${sort === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`}, play_count DESC
      `;

      const monthTopSongsMap = new Map<string, MonthSongPlay[]>();
      topSongsPerMonth.forEach(song => {
        const monthSongs = monthTopSongsMap.get(song.month) || [];
        if (monthSongs.length < 5) {
          monthSongs.push(song);
          monthTopSongsMap.set(song.month, monthSongs);
        }
      });

      //artist stats
      const artistStats = await prisma.$queryRaw<ArtistStats[]>`
        SELECT 
          (SELECT COUNT(*) FROM songs WHERE user_id = ${numericUserId}) as songs_uploaded,
          (SELECT COUNT(*) FROM song_plays sp JOIN songs s ON sp.song_id = s.song_id 
           WHERE s.user_id = ${numericUserId}) as total_plays,
          (SELECT COUNT(*) FROM follows WHERE user_id_b = ${numericUserId}) as followers_count
      `;

      //show uploaded songs
      const artistSongs = await prisma.$queryRaw<ArtistSong[]>`
        SELECT 
          s.song_id, 
          s.title,
          (SELECT COUNT(*) FROM song_plays sp WHERE sp.song_id = s.song_id) as play_count,
          a.album_art
        FROM songs s
        LEFT JOIN album a ON s.album_id = a.album_id
        WHERE s.user_id = ${numericUserId}
        ORDER BY play_count DESC
      `;

      const getAlbumArt = (albumArt: string | null | undefined): string | undefined => {
        return albumArt ?? undefined;
      }; //show album art

      const reportData: ReportData = {
        topSongs: topSongs.map(song => ({
          song_id: song.song_id,
          title: song.title,
          artist: song.artist,
          play_count: Number(song.play_count),
          album_art: getAlbumArt(song.album_art)
        })),
        topGenres: topGenres.map(g => ({
          genre: g.genre || 'Unknown',
          count: Number(g.count)
        })),
        totalPlayTime: Math.round(Number(stats[0]?.total_play_time || 0)),
        totalSongsPlayed: Number(stats[0]?.total_songs_played || 0),
        mostActiveHour: Number(mostActiveHour[0]?.hour || 0),
        monthlyStats: monthlyStats.map(month => ({
          month: month.month,
          play_count: Number(month.play_count),
          total_play_time: Math.round(Number(month.total_play_time)),
          topSongs: (monthTopSongsMap.get(month.month) || []).map(song => {
            const songDetail = topSongs.find(s => s.song_id === song.song_id) || artistSongs.find(s => s.song_id === song.song_id);
            return {
              song_id: song.song_id,
              title: songDetail?.title || 'Unknown',
              artist: songDetail ? 
                ('artist' in songDetail ? songDetail.artist as string : 'Unknown') : 
                'Unknown',
              play_count: Number(song.play_count),
              album_art: songDetail ? getAlbumArt('album_art' in songDetail ? songDetail.album_art : null) : undefined
            };
          })
        })),
        artistStats: {
          songs_uploaded: Number(artistStats[0]?.songs_uploaded || 0),
          total_plays: Number(artistStats[0]?.total_plays || 0),
          followers_count: Number(artistStats[0]?.followers_count || 0)
        },
        artistSongs: artistSongs.map(song => ({
          song_id: song.song_id,
          title: song.title,
          play_count: Number(song.play_count),
          album_art: getAlbumArt(song.album_art)
        }))
      };

      return NextResponse.json(convertBigIntToNumber(reportData));

    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}