import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/\/user\/(\d+)/);
    const userId = match ? parseInt(match[1]) : NaN;

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const albums = await prisma.album.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("❌ Error fetching artist albums:", error);
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}
