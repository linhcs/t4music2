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
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!username) return NextResponse.json({ error: 'Username is required' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await parseBuffer(buffer);
    const duration = metadata.format.duration ? Math.floor(metadata.format.duration) : 0;
    const fileUrl = await uploadToAzureBlobFromServer(buffer, file.name);
    
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let albumId: number | null = null;
    if (albumName) {
      const existingAlbum = await prisma.album.findFirst({
        where: { 
          title: albumName,
          user_id: user.user_id
        }
      });
    
      if (existingAlbum) {
        albumId = existingAlbum.album_id;
      } else {
        const newAlbum = await prisma.album.create({
          data: {
            title: albumName,
            user_id: user.user_id
          }
        });
        albumId = newAlbum.album_id;
      }
    }
    
    const song = await prisma.songs.create({
      data: {
        title: title || metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
        duration,
        file_path: fileUrl,
        file_format: file.name.split('.').pop() || 'mp3',
        user_id: user.user_id,
        ...(albumId && { album_id: albumId }),
        ...(genre && { genre }),
        URL: fileUrl,
        uploaded_at: new Date(),
        plays_count: 0
      },
      include: {
        users: {
          select: {
            username: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      song: {
        song_id: song.song_id,
        title: song.title,
        file_path: song.file_path,
        duration: song.duration,
        artist_name: song.users.username,
        ...(albumId && { album_id: albumId })
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';