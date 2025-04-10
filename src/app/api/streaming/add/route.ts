import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: NextRequest) {
  try {
    const { songId, artistId } = await req.json();
    const userId = Number(req.cookies.get("user_id")?.value);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // Only log the play count if not that artist itself
    if (userId !== artistId) {
      try {
        // Create record in streaming_history
        await prisma.streaming_history.create({
          data: {
            listener_id: userId,
            user_id: artistId,
            song_id: songId,
          },
        });

        // Create record in song_plays table as well using raw SQL
        // This is a workaround if Prisma doesn't recognize the model
        await prisma.$executeRaw`
          INSERT INTO song_plays (user_id, song_id) 
          VALUES (${userId}, ${songId})
        `;

        // Increment song play count
        await prisma.songs.update({
          where: { song_id: songId },
          data: { plays_count: { increment: 1 } },
        });

        console.log(`Song play recorded: User ${userId}, Song ${songId}`);
      } catch (innerErr) {
        console.error("Error recording play:", innerErr);
      }
    } else {
      console.log(
        `Play not counted: Artist ${artistId} played their own song ${songId}`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to record stream:", err);
    return NextResponse.json(
      { error: "Failed to record stream" },
      { status: 500 }
    );
  }
}
