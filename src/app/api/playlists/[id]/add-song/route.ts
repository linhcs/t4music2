import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { extractParamFromUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const idStr = extractParamFromUrl(req.url, "api/playlists");
    const playlist_id = idStr ? parseInt(idStr) : NaN;

    const { song_id } = await req.json();

    if (!song_id || isNaN(playlist_id)) {
      return NextResponse.json(
        { error: "Missing song_id or invalid playlist_id" },
        { status: 400 }
      );
    }

    const existing = await prisma.playlist_songs.findUnique({
      where: {
        playlist_id_song_id: {
          playlist_id,
          song_id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Song already in playlist" },
        { status: 409 }
      );
    }

    const added = await prisma.playlist_songs.create({
      data: {
        playlist_id,
        song_id,
      },
    });

    return NextResponse.json(added);
  } catch (err) {
    console.error("❌ Error adding song to playlist:", err);
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}
