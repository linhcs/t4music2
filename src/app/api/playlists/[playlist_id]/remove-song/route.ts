import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractParamFromUrl } from "@/lib/utils"; 
export async function DELETE(req: Request) {
  try {
    const playlistIdStr = extractParamFromUrl(req.url, "playlists");
    const playlist_id = playlistIdStr ? parseInt(playlistIdStr) : NaN;

    const { song_id } = await req.json();

    if (!song_id || isNaN(playlist_id)) {
      return NextResponse.json({ error: "Missing song_id or invalid playlist ID" }, { status: 400 });
    }

    await prisma.playlist_songs.delete({
      where: {
        playlist_id_song_id: {
          playlist_id,
          song_id: parseInt(song_id),
        },
      },
    });

    return NextResponse.json({ message: "Song removed from playlist" });
  } catch (error) {
    console.error("Failed to remove song:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
