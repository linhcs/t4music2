import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";

interface song {
    song_id: number;
    title: string;
  }
  
export async function GET() {
  try {
    // Query the database for some data
    const songs: song[] = await prisma.$queryRaw`
    SELECT song_id, title FROM songs;`;

    return NextResponse.json(songs)
  } catch (error:unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}