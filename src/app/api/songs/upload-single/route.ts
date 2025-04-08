import { NextResponse } from "next/server";
import { parseBuffer } from "music-metadata";
import { writeFile } from "fs/promises";
import { mkdirSync, existsSync } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const username = formData.get("username") as string;

    if (!file || !title || !genre || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ⏱️ Parse duration using music-metadata
    let duration = 0;
    try {
      const metadata = await parseBuffer(buffer);
      duration = metadata.format.duration ? Math.floor(metadata.format.duration) : 0;
    } catch (err) {
      console.warn("⚠️ Failed to extract metadata duration:", err);
    }

    // 📁 Save the file to /public/music/
    const uploadDir = path.join(process.cwd(), "public", "music");
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    const filename = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/music/${filename}`;

    // 🎤 Lookup user by username
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🎵 Create song entry (not tied to any album)
    const newSong = await prisma.songs.create({
      data: {
        title,
        genre,
        file_path: fileUrl,
        file_format: file.name.split(".").pop() || "mp3",
        duration,
        user_id: user.user_id,
        uploaded_at: new Date(),
        plays_count: 0,
      },
    });

    return NextResponse.json({
      success: true,
      song: {
        song_id: newSong.song_id,
        title: newSong.title,
        duration: newSong.duration,
        file_path: newSong.file_path,
        genre: newSong.genre,
        plays_count: newSong.plays_count,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading single track:", error);
    return NextResponse.json({ error: "Failed to upload song" }, { status: 500 });
  }
}
