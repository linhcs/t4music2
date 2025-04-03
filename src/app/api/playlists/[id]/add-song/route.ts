import { prisma } from "@prisma/script";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { song_id } = await req.json();
  const playlist_id = parseInt(params.id);

  if (!song_id || isNaN(playlist_id)) {
    return NextResponse.json(
      { error: "Missing song_id or invalid playlist_id" },
      { status: 400 }
    );
  }

  // Optional: check if the song is already in the playlist
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
}
