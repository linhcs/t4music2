import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractParamFromUrl } from "@/lib/utils";

export async function DELETE(req: Request) {
  try {
    const idStr = extractParamFromUrl(req.url, "songs");
    const song_id = idStr ? parseInt(idStr) : NaN;

    if (isNaN(song_id)) {
      return NextResponse.json({ error: "Invalid song ID" }, { status: 400 });
    }

    // First remove from any album_song relation
    await prisma.album_songs.deleteMany({ where: { song_id } });

    // Then delete the song itself
    await prisma.songs.delete({ where: { song_id } });

    return NextResponse.json({ message: "Song deleted" });
  } catch (error) {
    console.error("❌ Failed to delete song:", error);
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
