// src/app/api/playlists/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: Request) {
    const { name, user_id, playlist_art } = await req.json();
  console.log("🎵 Playlist request received:", { name, user_id });

  if (!name || !user_id) {
    return NextResponse.json(
      { error: "Missing name or user_id" },
      { status: 400 }
    );
  }

  const playlist = await prisma.playlists.create({
    data: {
      name,
      user_id,
      playlist_art,
      created_id: user_id,
    },
  });

  return NextResponse.json(playlist);
}
