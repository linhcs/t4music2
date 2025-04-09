import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
export async function GET() {
  try {
    const popularSongs = await prisma.songs.findMany({
      take: 20, // limiting to top 20 most played
      orderBy: {
        streaming_history: {
          _count: "desc",
        },
      },
      include: {
        album: true,
        users: {
          select: {
            username: true,
            pfp: true,
            user_id: true,
          },
        },
        streaming_history: true, 
      },
    });

    return NextResponse.json(popularSongs);
  } catch (error) {
    console.error("[POPULAR_SONGS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch popular songs" },
      { status: 500 }
    );
  }
}
