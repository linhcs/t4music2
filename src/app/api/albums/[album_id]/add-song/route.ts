import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, genre, file_path, file_format, duration, user_id, album_id } = await req.json();

    // Log payload for debugging
    console.log("🎵 Incoming song payload:", { title, genre, file_path, file_format, duration, user_id, album_id });

    if (!title || !file_path || !file_format || !user_id || !duration || !album_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSong = await prisma.songs.create({
      data: {
        title,
        genre,
        file_path,
        file_format,
        duration: parseInt(duration),
        user_id,
        album_id,
        album_songs: {
          create: {
            album_id, // ✅ Linking song into album_songs join table
          },
        },
      },
    });

    return NextResponse.json(newSong);
  } catch (err) {
    console.error("❌ Error uploading song:", err);
    return NextResponse.json({ error: "Failed to upload song" }, { status: 500 });
  }
}
