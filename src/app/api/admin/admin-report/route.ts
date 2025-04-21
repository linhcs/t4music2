import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const allArtists = await prisma.users.findMany({
      where: { role: "artist" },
      include: {
        songs: {
          include: {
            streaming_history: true,
          },
        },
        streaming_history_streaming_history_user_idTousers: true,
        follows_follows_user_id_bTousers: true,
      },
    });

    const topSongs = await prisma.songs.findMany({
      orderBy: { plays_count: "desc" },
      take: 10,
      include: {
        users: { select: { username: true } },
      },
    });

    const allSongs = await prisma.$queryRawUnsafe<
      {
        song_id: number;
        title: string;
        genre: string | null;
        play_count: number | null;
        username: string;
      }[]
    >(`
      SELECT s.song_id, s.title, s.genre, s.plays_count AS play_count, u.username
      FROM songs s
      JOIN users u ON s.user_id = u.user_id
    `);

    const cleanedAllSongs = allSongs.map((song) => ({
      song_id: song.song_id,
      title: song.title,
      artist: song.username,
      genre: song.genre || "Unknown",
      play_count: song.play_count || 0,
    }));

    const topGenres = await prisma.songs.groupBy({
      by: ["genre"],
      _count: { genre: true },
      orderBy: { _count: { genre: "desc" } },
      take: 10,
    });

    const streamingData = await prisma.streaming_history.findMany({
      include: {
        songs: true,
      },
    });

    const monthlyMap = new Map<
      string,
      {
        total_play_time: number;
        total_songs_added: number;
        genreCount: Record<string, number>;
        artistPlays: Map<number, number>;
        songPlays: Map<number, number>;
      }
    >();

    for (const stream of streamingData) {
      if (!stream.played_at) continue;
      const month = stream.played_at.toISOString().slice(0, 7);
      const duration = stream.songs?.duration || 0;
      const genre = stream.songs?.genre || "Unknown";
      const artistId = stream.songs?.user_id;
      const songId = stream.song_id;

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          total_play_time: 0,
          total_songs_added: 0,
          genreCount: {},
          artistPlays: new Map(),
          songPlays: new Map(),
        });
      }

      const stats = monthlyMap.get(month)!;
      stats.total_play_time += duration;
      stats.genreCount[genre] = (stats.genreCount[genre] || 0) + 1;

      if (artistId) {
        stats.artistPlays.set(
          artistId,
          (stats.artistPlays.get(artistId) || 0) + 1
        );
      }

      if (songId) {
        stats.songPlays.set(songId, (stats.songPlays.get(songId) || 0) + 1);
      }
    }

    const monthlyStats = Array.from(monthlyMap.entries()).map(
      ([month, stats]) => {
        const topGenre =
          Object.entries(stats.genreCount).sort(
            (a, b) => b[1] - a[1]
          )[0]?.[0] || "Unknown";
        return {
          month,
          total_play_time: Math.round(stats.total_play_time / 60),
          total_songs_added: stats.total_songs_added,
          top_genre: topGenre,
        };
      }
    );

    const artists = allArtists.map((artist) => {
      const play_count = artist.songs.reduce(
        (acc, s) => acc + s.streaming_history.length,
        0
      );
      const total_streaming_minutes = artist.songs.reduce(
        (acc, s) => acc + s.streaming_history.length * (s.duration / 60),
        0
      );

      return {
        user_id: artist.user_id,
        name: artist.username,
        genre: artist.songs[0]?.genre || "Unknown",
        followers: artist.follows_follows_user_id_bTousers.length,
        play_count,
        total_songs: artist.songs.length,
        total_streaming_minutes: Math.round(total_streaming_minutes),
      };
    });

    const totalPlayTime = Math.round(
      artists.reduce((acc, a) => acc + a.total_streaming_minutes, 0)
    );
    const totalSongsAdded = artists.reduce((acc, a) => acc + a.total_songs, 0);
    const topGenre = topGenres[0]?.genre || "Unknown";

    const monthlyTopSongs = Array.from(monthlyMap.entries()).map(
      ([month, stats]) => {
        const topSongs = Array.from(stats.songPlays.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([songId, count]) => {
            const song = cleanedAllSongs.find((s) => s.song_id === songId);
            return song ? { ...song, play_count: count } : null;
          })
          .filter(Boolean);

        return { month, songs: topSongs };
      }
    );

    const monthlyTopArtists = Array.from(monthlyMap.entries()).map(
      ([month, stats]) => {
        const topArtists = Array.from(stats.artistPlays.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([artistId, count]) => {
            const artist = artists.find((a) => a.user_id === artistId);
            return artist ? { ...artist, play_count: count } : null;
          })
          .filter(Boolean);

        return { month, artists: topArtists };
      }
    );

    const allAlbums = await prisma.album.findMany({
      include: {
        users: {
          select: { username: true },
        },
        songs: true,
      },
    });

    const formattedAlbums = allAlbums.map((album) => ({
      album_id: album.album_id,
      title: album.title,
      artist: album.users?.username || "Unknown",
      total_songs: album.songs.length,
      created_at: album.created_at,
    }));

    const supportTickets = await prisma.notifications.findMany({
      where: {
        message: {
          startsWith: '{"type":"support_ticket"',
        },
      },
      include: {
        users: {
          select: {
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedTickets = supportTickets
      .map((ticket) => {
        try {
          const ticketData = JSON.parse(ticket.message);
          return {
            notification_id: ticket.notification_id,
            user_id: ticket.user_id,
            username: ticket.users?.username || "Unknown",
            title: ticketData.title || "No Title",
            description: ticketData.description || "No Description",
            priority: ticketData.priority || "medium",
            category: ticketData.category || "general",
            created_at: ticket.created_at,
            is_read: ticket.is_read,
            metadata: ticketData.metadata || {},
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({
      allArtists: artists,
      topArtists: artists
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 10),
      topSongs: topSongs.map((song) => ({
        song_id: song.song_id,
        title: song.title,
        artist: song.users?.username || "Unknown",
        genre: song.genre || "Unknown",
        play_count: song.plays_count || 0,
      })),
      allSongs: cleanedAllSongs,
      topGenres: topGenres.map((g) => ({
        genre: g.genre || "Unknown",
        count: g._count.genre,
      })),
      monthlyStats,
      totalPlayTime,
      totalSongsAdded,
      topGenre,
      monthlyTopSongs,
      monthlyTopArtists,
      allAlbums: formattedAlbums,
      supportTickets: formattedTickets,
    });
  } catch (err) {
    console.error("[ADMIN_REPORT_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to generate admin report" },
      { status: 500 }
    );
  }
}
