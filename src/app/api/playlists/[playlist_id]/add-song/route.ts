import { prisma } from "@/lib/prisma";
import { extractParamFromUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const playlistIdStr = extractParamFromUrl(req.url, "playlists");
    const parsedId = playlistIdStr ? parseInt(playlistIdStr) : NaN;
    const { song_id } = await req.json();

    if (!song_id || isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Missing song_id or invalid playlist_id" },
        { status: 400 }
      );
    }

    const existing = await prisma.playlist_songs.findUnique({
      where: {
        playlist_id_song_id: {
          playlist_id: parsedId,
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
        playlist_id: parsedId,
        song_id,
      },
    });

    return NextResponse.json(added);
  } catch (err) {
    console.error("❌ Error adding song to playlist:", err);
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}
