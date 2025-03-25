import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";

interface listener {
    user_id: number;
    username: string;
  }
  
export async function GET() {
  try {
    // Query the database for some data
    const listeners: listener[] = await prisma.$queryRaw`
    SELECT * FROM users
    WHERE role = 'listener';`;

    return NextResponse.json(listeners)
  } catch (error:unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}