import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/\/albums\/(\d+)\/delete/);
    const albumId = match ? parseInt(match[1]) : NaN;

    if (isNaN(albumId)) {
      return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
    }

    await prisma.album.delete({
      where: { album_id: albumId },
    });

    return NextResponse.json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("❌ Album delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete album" },
      { status: 500 }
    );
  }
}
