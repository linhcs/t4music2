import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: Request) {
  const { username, songId } = await req.json();

  try {
    // looks up user
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.user_id;

    // checks if song is alr liked ee ee
    const result = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM likes WHERE listener_id = ? AND song_id = ?`,
      userId,
      songId
    );

    const alreadyLiked = result[0]?.count > 0;
// simple bool
    if (alreadyLiked) {//if alr liked, unlike
      await prisma.$executeRawUnsafe(
        `DELETE FROM likes WHERE listener_id = ? AND song_id = ?`,
        userId,
        songId
      );
      return NextResponse.json({ message: "Unliked", status: "removed" });
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO likes (listener_id, song_id, liked_at) VALUES (?, ?, NOW())`,
        userId,
        songId
      );
      return NextResponse.json({ message: "Liked", status: "added" });
    }
  } catch (err) {
    console.error("Toggle Like Error:", err);
    return NextResponse.json({ error: "Failed to toggle like." }, { status: 500 });
  }
}
