import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: { album_id: string } }
) {
  try {
    const albumId = parseInt(context.params.album_id);

    if (isNaN(albumId)) {
      return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
    }

    // Delete the album
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
