import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      select: {
        album_id: true,
        title: true,
        album_art: true,
        users: {
          select: {
            username: true,
          },
        },
      },
    });

    const formatted = albums.map(album => ({
      album_id: album.album_id,
      title: album.title,
      album_art: album.album_art,
      artist: album.users?.username || "Unknown Artist",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("❌ Error fetching albums:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, user_id } = await req.json();

    console.log("🚀 Album request received:", { title, user_id });

    if (!title || !user_id) {
      return NextResponse.json(
        { error: "Missing title or user_id" },
        { status: 400 }
      );
    }

    const album = await prisma.album.create({
      data: {
        title,
        user_id,
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error("Error creating album:", error);
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
