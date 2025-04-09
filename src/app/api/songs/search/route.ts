import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ songs: [], artists: [] });
  }

  try {
    // Raw query for songs (same as yours)
    const songs = await prisma.$queryRaw`
      SELECT 
        s.song_id,
        s.title,
        s.genre,
        s.duration,
        s.file_path,
        s.file_format,
        s.uploaded_at,
        s.plays_count,
        s.user_id,
        s.album_id,
        a.album_id as "album.album_id",
        a.title as "album.title",
        a.album_art as "album.album_art",
        u.username as "users.username"
      FROM songs s
      LEFT JOIN album a ON s.album_id = a.album_id
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE 
        s.title LIKE ${`%${query}%`} OR
        s.genre LIKE ${`%${query}%`} OR
        a.title LIKE ${`%${query}%`} OR
        u.username LIKE ${`%${query}%`}
      ORDER BY s.uploaded_at DESC
    `;

    // artist search (separate from songs)
    const artists = await prisma.users.findMany({
      where: {
        role: "artist",
        username: { contains: query},
      },
      select: {
        user_id: true,
        username: true,
        pfp: true,
      },
      take: 10,
    });

    return NextResponse.json({ songs, artists });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search songs and artists" },
      { status: 500 }
    );
  }
}
