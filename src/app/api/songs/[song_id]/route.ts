import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: { song_id: string } }) {
  const song_id = parseInt(params.song_id);

  try {
    await prisma.album_songs.deleteMany({ where: { song_id } });
    await prisma.songs.delete({ where: { song_id } });

    return NextResponse.json({ message: "Song deleted" });
  } catch (error) {
    console.error("❌ Failed to delete song:", error);
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
