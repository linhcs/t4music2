import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function POST(req: Request) {
    const { title, user_id } = await req.json();
  
    console.log("🚀 Album request received:", { title, user_id });
  
    if (!title || !user_id) {
      return NextResponse.json(
        { error: "Missing title or user_id" },
        { status: 400 }
      );
    }
  
    const album = await prisma.album.create({
      data: {
        title,
        user_id,
      },
    });
  
    return NextResponse.json(album);
  }
  