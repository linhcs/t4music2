import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching songs from database...");

    const songs = await prisma.songs.findMany({
      include: {
        album: true,
        users: true,
      },
      orderBy: {
        uploaded_at: "desc",
      },
    });

    console.log(`Successfully fetched ${songs.length} songs`);
    return NextResponse.json(songs);
  } catch (error: unknown) {
    console.error("❌ Failed to fetch songs:", error);

    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch songs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
