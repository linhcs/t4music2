import { NextResponse } from 'next/server';
import { uploadToAzureBlobFromServer } from '@/lib/azure-blob';
import { parseBuffer } from 'music-metadata';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const username = formData.get('username') as string;
    const title = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const albumName = formData.get('albumName') as string;

    if (!file || !username || !title || !genre || !albumName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Read audio buffer and extract metadata
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await parseBuffer(buffer);
    const duration = metadata.format.duration ? Math.floor(metadata.format.duration) : 0;

    // Upload file to Azure and get URL
    const fileUrl = await uploadToAzureBlobFromServer(buffer, file.name);

    // Get user
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Get or create album
    const existingAlbum = await prisma.album.findFirst({
      where: {
        title: albumName,
        user_id: user.user_id
      }
    });

    const album = existingAlbum || await prisma.album.create({
      data: {
        title: albumName,
        user_id: user.user_id
      }
    });

    // Create song and link to album
    const song = await prisma.songs.create({
      data: {
        title,
        genre,
        duration,
        file_path: fileUrl,
        file_format: file.name.split('.').pop() || 'mp3',
        user_id: user.user_id,
        album_id: album.album_id,
        uploaded_at: new Date(),
        plays_count: 0
      }
    });

    return NextResponse.json({
      success: true,
      song: {
        song_id: song.song_id,
        title: song.title,
        file_path: song.file_path,
        duration: song.duration,
        album_id: song.album_id
      }
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
