import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function GET(
  req: Request,
  context: { params: { username: string } }
) {
  // ✅ Destructure *inside* the function body to avoid Next.js warnings
  const { username } = await context.params;

  try {
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const playlists = await prisma.playlists.findMany({
      where: { user_id: user.user_id },
      orderBy: { updated_at: "desc" },
    });

    return NextResponse.json(playlists);
  } catch (err) {
    console.error("Error fetching playlists:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
