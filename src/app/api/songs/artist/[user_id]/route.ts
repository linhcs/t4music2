import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { extractParamFromUrl } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const idStr = extractParamFromUrl(req.url, "artist"); // or "user" based on your URL
    const user_id = idStr ? parseInt(idStr) : NaN;

    if (isNaN(user_id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const songs = await prisma.songs.findMany({
      where: { user_id },
      select: {
        song_id: true,
        title: true,
        file_path: true,
        file_format: true,  
        duration: true,
        plays_count: true,
        user_id: true,      
        album: {
          select: {
            album_art: true,
            title: true,
          },
        },
      },
      orderBy: { plays_count: "desc" },
    });
    
    return NextResponse.json(songs);
  } catch (error) {
    console.error("❌ Failed to fetch songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
