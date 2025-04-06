import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }

    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
