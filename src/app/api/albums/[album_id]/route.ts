import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { album_id: string } }
) {
  try {
    const albumId = parseInt(context.params.album_id); 

    const album = await prisma.album.findUnique({
      where: { album_id: albumId },
      include: {
        album_songs: {
          include: {
            songs: {
              select: {
                song_id: true,
                title: true,
                duration: true,
                file_path: true,
              },
            },
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const songs = album.album_songs.map((entry) => entry.songs);

    return NextResponse.json({
      album_id: album.album_id,
      title: album.title,
      album_art: album.album_art,
      songs,
    });
  } catch (err) {
    console.error("❌ Album fetch error:", err);
    return NextResponse.json({ error: "Failed to load album" }, { status: 500 });
  }
}
