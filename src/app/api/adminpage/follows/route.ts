import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/script';

interface followerstype{user_id: number; username: string; followed_at: string};

export async function POST(req: Request) {
  try {
    const { period, user_id }: { period: string; user_id: number } = await req.json();

    //console.log('Selected month:', period);

    // Convert "April 2024" → "2024-04-01"
    const [monthName, year] = period.split(' ');
    const month = new Date(`${monthName} 1, ${year}`).getMonth();
    const fiscalDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;

    //console.log('Querying followers up to:', fiscalDate);

    //console.log('user_id: ', user_id);

    const followers : followerstype[] = await prisma.$queryRaw`
      SELECT 
        DISTINCT f.user_id_a as user_id, 
        u.username, 
        f.follow_at
      FROM follows as f
      JOIN users as u ON u.user_id = f.user_id_a
      WHERE f.follow_at <= ${fiscalDate} and f.user_id_b = ${user_id}
      ORDER BY f.follow_at DESC;`;

    //console.log('followers: ', followers);
    
    return NextResponse.json(followers);
  } catch (err) {
    console.error('Followers route error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
