import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (!raw) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const query = body.query;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing or invalid query" }, { status: 400 });
    }

    const artists = await prisma.users.findMany({
      where: {
        role: "artist",
        username: {
          contains: query,
        },
      },
      select: {
        user_id: true,
        username: true,
        pfp: true,
      },
    });

    return NextResponse.json(artists);
  } catch (error: any) {
    const errMsg = error?.message || JSON.stringify(error) || "Unknown error";
    console.error("❌ Artist search route error:", errMsg);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
