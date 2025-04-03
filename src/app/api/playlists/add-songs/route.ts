import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";


export async function POST(req: Request) {
    const { playlistId, songId } = await req.json();
  
    try {
      await prisma.$executeRaw`
        INSERT INTO playlist_songs (playlist_id, song_id)
        VALUES (${playlistId}, ${songId})
      `;
      return NextResponse.json({ message: "Song added to playlist!" }, { status: 200 });
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      return NextResponse.json({ error: "Could not add song to playlist" }, { status: 500 });
    }
  }