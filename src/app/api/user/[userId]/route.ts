import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@prisma/script";

type TopTrackRow = {
  song_id: number;
  title: string;
  genre: string;
  file_path: string;
  play_count: number | string;
  last_played: Date | string;
};

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const userId = context.params.userId;
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { user_id: parsedUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const likedSongs = await prisma.$queryRawUnsafe(`
      SELECT s.song_id, s.title, s.genre, s.file_path, l.liked_at
      FROM likes l
      JOIN songs s ON l.song_id = s.song_id
      WHERE l.listener_id = ${parsedUserId};
    `);

    const playlists = await prisma.$queryRawUnsafe(`
      SELECT playlist_id, name, playlist_art
      FROM playlists
      WHERE user_id = ${parsedUserId};
    `);

    const streamingHistory = await prisma.$queryRawUnsafe(`
      SELECT s.song_id, s.title, s.genre, s.file_path, sh.played_at
      FROM streaming_history sh
      JOIN songs s ON sh.song_id = s.song_id
      WHERE sh.listener_id = ${parsedUserId}
      ORDER BY sh.played_at DESC
      LIMIT 10;
    `);

    const topTracksRaw = await prisma.$queryRawUnsafe(`
      SELECT s.song_id, s.title, s.genre, s.file_path,
             COUNT(*) AS play_count, MAX(sh.played_at) AS last_played
      FROM streaming_history sh
      JOIN songs s ON sh.song_id = s.song_id
      WHERE sh.listener_id = ${parsedUserId}
      GROUP BY s.song_id
      ORDER BY play_count DESC
      LIMIT 5;
    `);

    const topTracks = (topTracksRaw as TopTrackRow[]).map((track) => ({
      ...track,
      play_count: Number(track.play_count),
      last_played:
        track.last_played instanceof Date
          ? track.last_played.toISOString()
          : track.last_played,
    }));

    return NextResponse.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      pfp: user.pfp || "/default-pfp.jpg",
      likedSongs,
      playlists,
      streamingHistory,
      topTracks,
    });
  } catch (err) {
    console.error("Error loading user data:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
