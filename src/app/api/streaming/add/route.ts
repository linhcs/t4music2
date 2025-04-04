import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: Request) {
  try {
    const { userId, songId, artistId } = await req.json();

    await prisma.streaming_history.create({
      data: {
        listener_id: userId,
        user_id: artistId,
        song_id: songId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to record stream:", err);
    return NextResponse.json({ error: "Failed to record stream" }, { status: 500 });
  }
}