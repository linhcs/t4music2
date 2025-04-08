// src/app/api/playlists/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { extractParamFromUrl } from "@/lib/utils"; 

export async function GET(req: Request) {
  try {
    const idStr = extractParamFromUrl(req.url, "playlists");
    const playlist_id = idStr ? parseInt(idStr) : NaN;

    if (isNaN(playlist_id)) {
      return NextResponse.json({ error: "Invalid playlist ID" }, { status: 400 });
    }

    const playlist = await prisma.playlists.findUnique({
      where: { playlist_id },
      include: {
        playlist_songs: {
          include: {
            songs: true,
          },
        },
      },
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    return NextResponse.json(playlist);
  } catch (err) {
    console.error("❌ Failed to fetch playlist:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
