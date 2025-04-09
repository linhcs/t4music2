import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/script";

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.cookies.get("user_id")?.value);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // getting the user's streaming history with genres
    const history = await prisma.streaming_history.findMany({
      where: { listener_id: userId },
      include: {
        songs: {
          select: { genre: true },
        },
      },
    });

    const genreCounts: Record<string, number> = {};
    history.forEach((entry) => {
      const genre = entry.songs.genre;
      if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    if (sortedGenres.length === 0) {
      return NextResponse.json({ songs: [] }); // fallback if no history
    }

    const recommendedSongs = await prisma.songs.findMany({
      where: {
        genre: { in: sortedGenres },
        NOT: { user_id: userId }, 
      },
      include: {
        album: true,
        users: {
          select: {
            username: true,
            user_id: true,
            pfp: true,
          },
        },
      },
      take: 10,
    });

    return NextResponse.json({ songs: recommendedSongs });
  } catch (err) {
    console.error("Error in /api/songs/recommended:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
