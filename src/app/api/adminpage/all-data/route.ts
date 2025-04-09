import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";
import { console } from 'inspector';

interface ReportData {q1: bigint; q2: bigint; q3: bigint; q4: bigint; q1_2: bigint; q2_2: bigint; total: bigint;}
interface tReportData {q1: number; q2: number; q3: number; q4: number; q1_2: number; q2_2: number; total: number;}
interface CategoryData {listeners: tReportData[]; artists: tReportData[]; likes: tReportData[]; follows: tReportData[]; streaminghours: tReportData[]; uploads: tReportData[];}
 
export async function GET() {
  try {
    // Query the database for some data
    const listener: ReportData[] = await prisma.$queryRaw`
    SELECT 
        (Select count(user_id) FROM users Where created_at <= '2024-03-31' AND role = 'listener' ) as q1,
        (Select count(user_id) FROM users Where created_at <= '2024-06-30' AND role = 'listener' ) as q2,
        (Select count(user_id) FROM users Where created_at <= '2024-09-30' AND role = 'listener' ) as q3,
        (Select count(user_id) FROM users Where created_at <= '2024-12-31' AND role = 'listener' ) as q4,
        (Select count(user_id) FROM users Where created_at <= '2025-03-31' AND role = 'listener' ) as q1_2,
        (Select count(user_id) FROM users Where created_at <= '2025-06-30' AND role = 'listener' ) as q2_2,
        (Select count(user_id) FROM users Where role = 'listener' ) as total;`;
    
    const artist: ReportData[] = await prisma.$queryRaw`
    SELECT 
            (Select count(user_id) FROM users Where created_at <= '2024-03-31' AND role = 'artist' ) as q1,
            (Select count(user_id) FROM users Where created_at <= '2024-06-30' AND role = 'artist' ) as q2,
            (Select count(user_id) FROM users Where created_at <= '2024-09-30' AND role = 'artist' ) as q3,
            (Select count(user_id) FROM users Where created_at <= '2024-12-31' AND role = 'artist' ) as q4,
            (Select count(user_id) FROM users Where created_at <= '2025-03-31' AND role = 'artist' ) as q1_2,
            (Select count(user_id) FROM users Where created_at <= '2025-06-30' AND role = 'artist' ) as q2_2,
            (Select count(user_id) FROM users Where role = 'artist' ) as total;`;
    const like: ReportData[] = await prisma.$queryRaw`
    SELECT 
            (Select count(like_id) FROM likes Where liked_at <= '2024-03-31' ) as q1,
            (Select count(like_id) FROM likes Where liked_at <= '2024-06-30' ) as q2,
            (Select count(like_id) FROM likes Where liked_at <= '2024-09-30' ) as q3,
            (Select count(like_id) FROM likes Where liked_at <= '2024-12-31' ) as q4,
            (Select count(like_id) FROM likes Where liked_at <= '2025-03-31' ) as q1_2,
            (Select count(like_id) FROM likes Where liked_at <= '2025-06-30' ) as q2_2,
            (Select count(like_id) FROM likes ) as total;`;
    const follow: ReportData[] = await prisma.$queryRaw`
    SELECT 
            (Select count(follow_id) FROM follows Where follow_at <= '2024-03-31' ) as q1,
            (Select count(follow_id) FROM follows Where follow_at <= '2024-06-30' ) as q2,
            (Select count(follow_id) FROM follows Where follow_at <= '2024-09-30' ) as q3,
            (Select count(follow_id) FROM follows Where follow_at <= '2024-12-31' ) as q4,
            (Select count(follow_id) FROM follows Where follow_at <= '2025-03-31' ) as q1_2,
            (Select count(follow_id) FROM follows Where follow_at <= '2025-06-30' ) as q2_2,
            (Select count(follow_id) FROM follows ) as total;`;
    const streaminghour: ReportData[] = await prisma.$queryRaw`
    SELECT 
            (Select FLOOR(SUM(duration) / 3600) FROM hours Where played_at <= '2024-03-31' ) as q1,
            (Select FLOOR(SUM(duration) / 3600) FROM hours Where played_at <= '2024-06-30' ) as q2,
            (Select FLOOR(SUM(duration) / 3600) FROM hours Where played_at <= '2024-09-30' ) as q3,
            (Select FLOOR(SUM(duration) / 3600) FROM hours Where played_at <= '2024-12-31' ) as q4,
            (Select FLOOR(SUM(duration) / 3600) FROM hours Where played_at <= '2025-03-31' ) as q1_2,
            (Select FLOOR(SUM(duration) / 3600) FROM hours Where played_at <= '2025-06-30' ) as q2_2,
            (Select FLOOR(SUM(duration) / 3600) FROM hours ) as total;`;
    const upload: ReportData[] = await prisma.$queryRaw`
    SELECT 
            (Select count(song_id) FROM songs Where uploaded_at <= '2024-03-31' ) as q1,
            (Select count(song_id) FROM songs Where uploaded_at <= '2024-06-30' ) as q2,
            (Select count(song_id) FROM songs Where uploaded_at <= '2024-09-30' ) as q3,
            (Select count(song_id) FROM songs Where uploaded_at <= '2024-12-31' ) as q4,
            (Select count(song_id) FROM songs Where uploaded_at <= '2025-03-31' ) as q1_2,
            (Select count(song_id) FROM songs Where uploaded_at <= '2025-06-30' ) as q2_2,
            (Select count(song_id) FROM songs ) as total;`;

    const transformBigIntToNumber = (data: ReportData[]) => {
        return data.map(item => ({
          q1: Number(item.q1),
          q2: Number(item.q2),
          q3: Number(item.q3),
          q4: Number(item.q4),
          q1_2: Number(item.q1_2),
          q2_2: Number(item.q2_2),
          total: Number(item.total),
        }));
    };

    const tlistener = transformBigIntToNumber(listener);
    const tartist = transformBigIntToNumber(artist);
    const tlike = transformBigIntToNumber(like);
    const tfollow = transformBigIntToNumber(follow);
    const tstreaminghour = transformBigIntToNumber(streaminghour);
    console.log(streaminghour)
    console.log(tstreaminghour)
    const tupload = transformBigIntToNumber(upload);

    const data : CategoryData = {listeners: tlistener, artists: tartist, likes: tlike, follows: tfollow, streaminghours: tstreaminghour, uploads: tupload };
    return NextResponse.json(data)
  } catch (error:unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
