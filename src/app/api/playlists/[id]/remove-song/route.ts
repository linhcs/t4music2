import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { song_id } = await req.json();

  if (!song_id) {
    return NextResponse.json({ error: "Missing song_id" }, { status: 400 });
  }

  try {
    await prisma.playlist_songs.delete({
      where: {
        playlist_id_song_id: {
          playlist_id: parseInt(id),
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
