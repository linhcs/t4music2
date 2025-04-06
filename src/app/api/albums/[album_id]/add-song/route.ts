import { NextResponse } from "next/server";
import { uploadToAzureBlobFromServer } from "@/lib/azure-blob";
import { parseBuffer } from "music-metadata";
import prisma from "@/lib/prisma";

export async function POST(req: Request, context: { params: { album_id: string } }) {
  try {
    const album_id = parseInt(context.params.album_id);
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const username = formData.get("username") as string;

    if (!file || !title || !genre || !username || !album_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await parseBuffer(buffer);
    const duration = metadata.format.duration ? Math.floor(metadata.format.duration) : 0;

    const fileUrl = await uploadToAzureBlobFromServer(buffer, file.name);

    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newSong = await prisma.songs.create({
      data: {
        title,
        genre,
        file_path: fileUrl,
        file_format: file.name.split(".").pop() || "mp3",
        duration,
        user_id: user.user_id,
        album_id,
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
        album_id: newSong.album_id,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading song:", error);
    return NextResponse.json({ error: "Failed to upload song" }, { status: 500 });
  }
}
