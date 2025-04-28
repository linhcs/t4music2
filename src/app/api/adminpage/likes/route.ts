import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/script';

interface likestype { plays: bigint; title: string };

export async function POST(req: Request) {
    try {
        const { period, user_id }: { period: string; user_id: number } = await req.json();

        //console.log('Selected month:', period);

        // Convert "April 2024" → "2024-04-01"
        const [monthName, year] = period.split(' ');
        const month = new Date(`${monthName} 1, ${year}`).getMonth();
        const fiscalDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;

        //console.log('Querying likes up to:', fiscalDate);

        //console.log('user_id: ', user_id);

        const prelikes: likestype[] = await prisma.$queryRaw`
      SELECT 
        count(l.listener_id) as plays,
        s.title
        FROM likes as l
        JOIN songs as s ON s.song_id = l.song_id
        WHERE liked_at <= ${fiscalDate}  and s.user_id = ${user_id}
        group by s.title
        order by plays DESC;`;

        const likes = prelikes.map(item => ({
            plays: item.plays ? Number(item.plays) : 0,
            title: item.title,
        }));
        //console.log('likes: ', likes);

        return NextResponse.json(likes);
    } catch (err) {
        console.error('likes route error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
