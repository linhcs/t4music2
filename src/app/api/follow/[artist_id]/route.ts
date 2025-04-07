import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { extractParamFromUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const artistIdStr = extractParamFromUrl(req.url, "follow");
    const artist_id = artistIdStr ? parseInt(artistIdStr) : NaN;

    if (isNaN(artist_id)) {
      return NextResponse.json({ error: "Invalid artist ID" }, { status: 400 });
    }

    const { user_id } = await req.json();

    const existing = await prisma.follows.findFirst({
      where: {
        user_id_a: user_id,
        user_id_b: artist_id,
      },
    });

    if (existing) {
      // Unfollow
      await prisma.follows.delete({
        where: { follow_id: existing.follow_id },
      });
      return NextResponse.json({ following: false });
    } else {
      // Follow
      await prisma.follows.create({
        data: {
          user_id_a: user_id,
          user_id_b: artist_id,
        },
      });
      return NextResponse.json({ following: true });
    }
  } catch (err) {
    console.error("❌ Follow/unfollow error:", err);
    return NextResponse.json({ error: "Failed to process follow request" }, { status: 500 });
  }
}
