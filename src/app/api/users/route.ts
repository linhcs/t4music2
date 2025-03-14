// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/script";

export async function POST(request: Request) {
  try {
    const result = await request.json();
    console.log(result);
    if (!result.username || !result.password_hash) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }
    try {
      await prisma.$queryRaw`INSERT INTO users (username, password_hash, email, role) VALUES (${
        result.username
      }, ${result.password_hash}, ${
        result.email || `${result.username}@example.com`
      }, 'listener')`;
    } catch (e) {
      console.log("ERROR", e);
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
