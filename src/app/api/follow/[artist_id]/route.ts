import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { artist_id: string } }) {
  const { user_id } = await req.json();

  const existing = await prisma.follows.findFirst({
    where: {
      user_id_a: user_id,
      user_id_b: Number(params.artist_id),
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
        user_id_b: Number(params.artist_id),
      },
    });
    return NextResponse.json({ following: true });
  }
}
