// import { createSearchParamsFromClient } from "next/dist/server/request/search-params";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const result = await req.json();
    console.log(result);
    const { title, artist } = result;
    console.log(title, artist);
    if (!title || !artist) {
      return NextResponse.json(
        { error: "Title and artist are required" },
        { status: 400 }
      );
    }
    try {
      await prisma.$queryRaw`INSERT INTO songs (title, artist_id) VALUES (${title}, ${artist}) RETURNING *`;
    } catch {
      return NextResponse.json(
        { error: "Failed to add song to the database" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Song created successfully", song: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
