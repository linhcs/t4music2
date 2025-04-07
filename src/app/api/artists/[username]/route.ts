import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { username: string } }) {
  try {
    const { username } = context.params;

    const { searchParams } = new URL(req.url);
    const viewer = Number(searchParams.get("viewer"));

    const user = await prisma.users.findUnique({
      where: { username },
      include: {
        album: {
          include: {
            songs: {
              include: {
                album: true,
                users: {
                  select: { username: true },
                },
              },
            },
          },
        },
        songs: {
          orderBy: { plays_count: "desc" },
          take: 5,
          include: {
            album: true,
            users: {
              select: { username: true },
            },
          },
        },
      },
    });

    if (!user || user.role !== "artist") {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Count followers
    const followerCount = await prisma.follows.count({
      where: { user_id_b: user.user_id },
    });

    // Check if viewer follows this artist
    const isFollowing = viewer
      ? !!(await prisma.follows.findFirst({
          where: {
            user_id_a: viewer,
            user_id_b: user.user_id,
          },
        }))
      : false;

    return NextResponse.json({
      ...user,
      followers: followerCount,
      isFollowing,
    });
  } catch (err) {
    console.error("Error fetching artist:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
