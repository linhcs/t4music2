import { prisma } from "@prisma/script";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: any
) {
  // ✅ Safely access params from awaited context object
  const { username } = await context.params;

  try {
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const albums = await prisma.album.findMany({
      where: { user_id: user.user_id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(albums);
  } catch (err) {
    console.error("Error fetching albums:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
