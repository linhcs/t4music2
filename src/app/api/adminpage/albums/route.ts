import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";

  interface album {
    user_id: number;
    album_id: number;
    title: string;
  }

export async function GET() {
  try {
    // Query the database for some data
    const albums: album[] = await prisma.$queryRaw`
    SELECT * FROM album;`;

    return NextResponse.json(albums)
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
