import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, album_art, user_id } = body;

    if (!title || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAlbum = await prisma.album.create({
      data: {
        title,
        album_art,
        user_id,
      },
    });

    return NextResponse.json(newAlbum);
  } catch (error) {
    console.error("Create album error:", error);
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
