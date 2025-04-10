import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { extractParamFromUrl } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const username = extractParamFromUrl(req.url, "artists");
    const { searchParams } = new URL(req.url);
    const viewer = Number(searchParams.get("viewer"));

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

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

    const followerCount = await prisma.follows.count({
      where: { user_id_b: user.user_id },
    });

    // Ensure all songs have necessary fields
    const topTracks = user.songs.map((song) => ({
      ...song,
      duration: song.duration || 180, // fallback if missing
      file_format: song.file_format || "mp3", // fallback if missing
      user_id: song.user_id || user.user_id, // ensure user_id is set
    }));

    const isFollowing = viewer
      ? !!(await prisma.follows.findFirst({
          where: {
            user_id_a: viewer,
            user_id_b: user.user_id,
          },
        }))
      : false;

    // Include topTracks in the response
    return NextResponse.json({
      ...user,
      followers: followerCount,
      isFollowing,
      topTracks,  // Include topTracks
    });
  } catch (err) {
    console.error("Error fetching artist:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
