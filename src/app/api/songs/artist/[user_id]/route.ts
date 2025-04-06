// /app/api/songs/artist/[user_id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { user_id: string } }) {
  try {
    const songs = await prisma.songs.findMany({
      where: { user_id: Number(params.user_id) },
      include: {
        album: {
          select: { album_art: true }
        }
      },
      orderBy: { plays_count: "desc" }
    });

    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
