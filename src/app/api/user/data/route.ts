import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";

type UserRow = {
  user_id: number;
  username: string;
  role: string;
  email: string;
  pfp: string;
};

type Song = {
  song_id: number;
  title: string;
  genre: string;
  file_path: string;
  liked_at?: string;
  played_at?: string;
};

type Playlist = {
  playlist_id: number;
  name: string;
  playlist_art: string;
};

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    //  getting user info first
    const user: UserRow[] = await prisma.$queryRawUnsafe(`
      SELECT user_id, username, role, email, pfp 
      FROM users 
      WHERE username = '${username}' 
      LIMIT 1;
    `);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user[0].user_id;

// getting song info
   const likedSongs: Song[] = await prisma.$queryRawUnsafe(`
      SELECT 
        s.song_id, s.title, s.genre, s.file_path, l.liked_at
      FROM likes l
      JOIN songs s ON l.song_id = s.song_id
      WHERE l.listener_id = ${userId};
    `);

    // playlists info
    const playlists: Playlist[] = await prisma.$queryRawUnsafe(`
      SELECT 
        playlist_id, name, playlist_art
      FROM playlists
      WHERE user_id = ${userId};
    `);

    // 4. streaming history (i put 10 last songs played)
    const streamingHistory: Song[] = await prisma.$queryRawUnsafe(`
      SELECT 
        s.song_id,
        s.title,
        s.genre,
        s.file_path,
        sh.played_at
      FROM streaming_history sh
      JOIN songs s ON sh.song_id = s.song_id
      WHERE sh.listener_id = ${userId}
      ORDER BY sh.played_at DESC
      LIMIT 10;
    `);

    return NextResponse.json({
      userId,
      username: user[0].username,
      email: user[0].email,
      role: user[0].role,
      pfp: user[0].pfp,
      likedSongs,
      playlists,
      streamingHistory,
    });
  } catch (err) {
    console.error("Raw SQL error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
