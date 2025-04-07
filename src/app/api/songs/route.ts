import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const songs = await prisma.songs.findMany({
      include: {
        album: true,
      },
      orderBy: {
        uploaded_at: "desc",
      },
    });

    return NextResponse.json(songs);
  } catch (error: unknown) {
    console.error("❌ Failed to fetch songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
