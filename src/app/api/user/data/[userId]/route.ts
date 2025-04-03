// File: src/app/api/user/[userId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId);

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const likedSongs = await prisma.$queryRawUnsafe(`
      SELECT s.*, l.liked_at
      FROM likes l
      JOIN songs s ON l.song_id = s.song_id
      WHERE l.listener_id = ${userId};
    `);

    const playlists = await prisma.playlists.findMany({
      where: { user_id: userId },
    });

    const albums = await prisma.album.findMany({
      where: { user_id: userId },
      include: { songs: true },
    });

    const uploadedSongs = await prisma.songs.findMany({
      where: { user_id: userId },
    });

    const streamingHistory = await prisma.$queryRawUnsafe(`
      SELECT s.*, sh.played_at
      FROM streaming_history sh
      JOIN songs s ON s.song_id = sh.song_id
      WHERE sh.listener_id = ${userId}
      ORDER BY sh.played_at DESC
      LIMIT 10;
    `);

    const followers = await prisma.follows.count({
      where: { user_id_b: userId },
    });

    const following = await prisma.follows.count({
      where: { user_id_a: userId },
    });

    return NextResponse.json({
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      email: user.email,
      pfp: user.pfp,
      likedSongs,
      playlists,
      albums,
      uploadedSongs,
      streamingHistory,
      followers,
      following,
    });
  } catch (err) {
    console.error("User fetch error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
