import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const followerId = Number(searchParams.get("followerId"));
  const followedId = Number(searchParams.get("followedId"));

  if (!followerId || !followedId || followerId === followedId) {
    return NextResponse.json({ following: false });
  }

  const exists = await prisma.follows.findFirst({
    where: {
      user_id_a: followerId,
      user_id_b: followedId,
    },
  });

  return NextResponse.json({ following: !!exists });
}
