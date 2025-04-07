import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { user_id: string } }
) {
  const { user_id } = context.params;

  try {
    const songs = await prisma.songs.findMany({
      where: { user_id: Number(user_id) },
      include: {
        album: {
          select: { album_art: true },
        },
      },
      orderBy: { plays_count: "desc" },
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error("❌ Failed to fetch songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
