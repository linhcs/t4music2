// app/api/artists/[username]/route.ts
import { prisma } from "@prisma/script";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { username: string } }) {
  try {
    const user = await prisma.users.findUnique({
      where: { username: params.username },
    });

    if (!user || user.role !== "artist") {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Error fetching artist:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
