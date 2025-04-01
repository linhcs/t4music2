import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const songs = await prisma.songs.findMany({
      include: {
        users: {
          select: {
            username: true,
            pfp: true
          }
        },
        album: {
          select: {
            album_art: true,
            title: true
          }
        }
      },
      orderBy: {
        uploaded_at: 'desc'
      },
      take: 50
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}