// app/api/albums/user/[user_id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { user_id: string } }) {
  try {
    const albums = await prisma.album.findMany({
      where: {
        user_id: parseInt(params.user_id),
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
