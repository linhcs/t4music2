import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractParamFromUrl } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const username = extractParamFromUrl(req.url, "user");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

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
    console.error("❌ Error fetching playlists:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
