import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, genre, file_path, user_id, album_id } = body;

    if (!title || !file_path || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSong = await prisma.songs.create({
      data: {
        title,
        genre,
        file_path,
        user_id,
        album_id: album_id || null,
        file_format: "mp3", // or infer from file_path
        duration: 0, // update if you process it later
      },
    });

    return NextResponse.json(newSong);
  } catch (error) {
    console.error("Upload song error:", error);
    return NextResponse.json({ error: "Failed to upload song" }, { status: 500 });
  }
}
