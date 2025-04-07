// src/app/api/playlists/[id]/route.ts
import { prisma } from "@prisma/script";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

  const playlist = await prisma.playlists.findUnique({
    where: { playlist_id: parseInt(id) },
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
}
