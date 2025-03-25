import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";

  interface artist {
    user_id: number;
    username: string;
  }

export async function GET() {
  try {
    // Query the database for some data
    const artists: artist[] = await prisma.$queryRaw`
    SELECT * FROM users
    WHERE role = 'artist';`;

    return NextResponse.json(artists)
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
