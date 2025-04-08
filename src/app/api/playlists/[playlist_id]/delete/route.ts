import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractParamFromUrl } from "@/lib/utils";

export async function DELETE(req: Request) {
  try {
    const idStr = extractParamFromUrl(req.url, "playlists");
    const playlistId = idStr ? parseInt(idStr) : NaN;

    if (isNaN(playlistId)) {
      return NextResponse.json({ error: "Invalid playlist ID." }, { status: 400 });
    }

    await prisma.playlists.delete({
      where: { playlist_id: playlistId },
    });

    return NextResponse.json({ message: "Playlist deleted successfully." });
  } catch (error) {
    console.error("❌ Failed to delete playlist:", error);
    return NextResponse.json({ error: "Failed to delete playlist." }, { status: 500 });
  }
}
