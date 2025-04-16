import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";
import { Decimal } from '@prisma/client/runtime/library';

interface rankinfo {Rank: bigint; user_id: number; username: string; Followers: bigint; likes: bigint; 'Streamed Hours': Decimal; score: Decimal; min: string; };
interface genrelist{genre: string; count: bigint};
  
const fiscalPeriods = [
  '2024-03-31', // Q1 2024
  '2024-06-30', // Q2 2024
  '2024-09-30', // Q3 2024
  '2024-12-31', // Q4 2024
  '2025-03-31', // Q1 2025
  '2025-06-30', // Q2 2025
];

export async function POST(req: Request) {
  try {
    const { period }: { period: string } = await req.json();
    console.log('period: ',period);
    const quarterIndex = parseInt(period[1]) - 1;
    const yearDigit = period[8];
    const fiscalOffset = yearDigit === '4' ? 0 : 4;
    const currentIndex = fiscalOffset + quarterIndex;
    const currentFiscalDate = fiscalPeriods[currentIndex];
    const previousFiscalDate = fiscalPeriods[currentIndex - 1] || '2024-01-01';


    const ranks: rankinfo[] = await prisma.$queryRaw`With atts AS (
        SELECT
          U.user_id,
          (SELECT FLOOR(SUM(duration) / 3600) FROM Hours WHERE user_id = U.user_id AND played_at <= ${currentFiscalDate} ) AS tstream,
          (SELECT COUNT(*) FROM follows WHERE user_id_b = U.user_id AND follow_at <= ${currentFiscalDate} ) AS tfollows,
          (SELECT COUNT(*) FROM likes AS L JOIN songs AS S ON L.song_id = S.song_id WHERE S.user_id = U.user_id AND liked_at <= ${currentFiscalDate} ) AS tlikes
        FROM (SELECT DISTINCT user_id FROM songs) AS U
          )
      SELECT 
        ROW_NUMBER() OVER() as 'Rank',
        A.user_id,
        U.username,
          tfollows as 'Followers',
          tlikes as 'likes',
          tstream as 'Streamed Hours',
        (tfollows * .5 + tlikes * .3 + tstream * .2) AS 'score',
          (CASE WHEN tfollows * .5 <= tlikes * .3 THEN 
          (CASE WHEN tstream * .2 <  tfollows * .5 THEN 'hours' ELSE 'follows' END) 
          ELSE 
          (CASE WHEN tstream * .2 <  tlikes * .3 THEN 'hours' ELSE 'likes' END) 
        END ) as min
      from atts as A
      join users as U on A.user_id = U.user_id
      Order by score desc;`;

    const transformBigIntToNumber = (data: rankinfo[]) => {
        return data.map(item => ({
          rank: item.Rank ? Number(item.Rank) : 0,
          user_id: item.user_id,
          username: item.username,
          followers: item.Followers ? Number(item.Followers) : 0,
          likes: item.likes? Number(item.likes) : 0,
          streamedHours: item['Streamed Hours'] ? Number(item['Streamed Hours']) : 0,
          score: Number(item.score),
          min: item.min,
        }));
    };

    const rankspre: rankinfo[] = await prisma.$queryRaw`With atts AS (
        SELECT
          U.user_id,
          (SELECT FLOOR(SUM(duration) / 3600) FROM Hours WHERE user_id = U.user_id AND played_at <= ${previousFiscalDate} ) AS tstream,
          (SELECT COUNT(*) FROM follows WHERE user_id_b = U.user_id AND follow_at <= ${previousFiscalDate} ) AS tfollows,
          (SELECT COUNT(*) FROM likes AS L JOIN songs AS S ON L.song_id = S.song_id WHERE S.user_id = U.user_id AND liked_at <= ${previousFiscalDate} ) AS tlikes
        FROM (SELECT DISTINCT user_id FROM songs) AS U
          )
      SELECT 
        ROW_NUMBER() OVER() as 'Rank',
        A.user_id,
        U.username,
          tfollows as 'Followers',
          tlikes as 'likes',
          tstream as 'Streamed Hours',
        (tfollows * .5 + tlikes * .3 + tstream * .2) AS 'score',
          (CASE WHEN tfollows * .5 <= tlikes * .3 THEN 
          (CASE WHEN tstream * .2 <  tfollows * .5 THEN 'hours' ELSE 'follows' END) 
          ELSE 
          (CASE WHEN tstream * .2 <  tlikes * .3 THEN 'hours' ELSE 'likes' END) 
        END ) as min
      from atts as A
      join users as U on A.user_id = U.user_id
      Order by score desc;`;

    const tranks = transformBigIntToNumber(ranks);
    const trankspre = transformBigIntToNumber(rankspre);

    const trankspreMap = Object.fromEntries(trankspre.map(item => [item.user_id, item]));

    // Reorder trankspre to match the order of tranks
    const alignedTrankspre = tranks.map(item => trankspreMap[item.user_id]);
    //console.log('tranks in route: ',tranks)
    //console.log('alignedtrankspre in route: ',alignedTrankspre)
    //console.log('ranks in route: ',ranks)

    const infoarr : [string[]] = [[]];

    for(let i = 0; i < tranks.length; i ++)
    {
      const top3: genrelist[] = await prisma.$queryRaw
        `select LOWER(trim(genre)) as genre, COUNT(*) AS 'count'
          from songs 
          where genre != '' AND user_id = ${tranks[i].user_id}
          group by genre
          ORDER by COUNT(*) DESC 
          Limit 3;`;
      //console.log('top3: ', top3);
      if(top3.length !== 0)
        {
          const temp : string[] = [top3[0].genre];
        for(let j = 1; j < top3.length; j++)
        {
          if(Number(top3[j].count) > 4){temp.push(top3[j].genre)};
        }
        if(infoarr[0].length == 0) {
          infoarr[0] = temp;
        }else {
          infoarr.push(temp);
        };
      } else {infoarr.push([]);};
    };


    console.log("fiscal Period: ", currentFiscalDate)
    console.log('Rank Data:', tranks[0]);
    //console.log('Pre Rank Data:', alignedTrankspre);
    //console.log('Info Array:', infoarr);

    return NextResponse.json({tranks, alignedTrankspre, infoarr})
  } catch (error:unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
