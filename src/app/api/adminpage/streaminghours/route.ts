import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/script';
import { Decimal } from '@prisma/client/runtime/library';

interface hourstype { hours: Decimal; title: string };

export async function POST(req: Request) {
    try {
        const { period, user_id }: { period: string; user_id: number } = await req.json();

        //console.log('Selected month:', period);

        // Convert "April 2024" → "2024-04-01"
        const [monthName, year] = period.split(' ');
        const month = new Date(`${monthName} 1, ${year}`).getMonth();
        const fiscalDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;

        //console.log('Querying hours up to:', fiscalDate);

        //console.log('user_id: ', user_id);

        const prehours: hourstype[] = await prisma.$queryRaw`
        SELECT 
        round(SUM(duration) / 3600, 2)  as hours,
        s.title
        FROM streaming_history as sh
        JOIN songs as s ON s.song_id = sh.song_id
        WHERE played_at <= ${fiscalDate} and s.user_id = ${user_id}
        group by s.title
        order by hours DESC;`;

        const hours = prehours.map(item => ({
            hours: item.hours ? Number(item.hours) : 0,
            title: item.title,
        }));
        console.log('hours: ', hours);

        return NextResponse.json(hours);
    } catch (err) {
        console.error('hours route error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
