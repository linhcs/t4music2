import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: Request) {
    try {
      const { userId, name } = await req.json();
  
      await prisma.$executeRaw`
        INSERT INTO playlists (user_id, name, created_at)
        VALUES (${userId}, ${name}, NOW())
      `;
  
      return NextResponse.json({ message: "Playlist created!" });
    } catch (error) {
        if (error instanceof Error){
            console.error(error.message);
        } else {
            console.error("Error, could not create playlist!");
        }
    }
}
  