import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const playlistId = parseInt(params.id);

  try {
    await prisma.playlists.delete({
      where: { playlist_id: playlistId },
    });

    return NextResponse.json({ message: "Playlist deleted successfully." });
  } catch (error) {
    console.error("❌ Failed to delete playlist:", error);
    return NextResponse.json({ error: "Failed to delete playlist." }, { status: 500 });
  }
}
