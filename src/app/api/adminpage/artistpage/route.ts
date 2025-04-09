import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";
import { Decimal } from '@prisma/client/runtime/library';

interface rankinfo {rank: bigint; user_id: number; username: string; followers: bigint; likes: bigint; streamedHours: Decimal; score: Decimal; min: string; };
interface genrelist{genre: string; count: bigint};
  

export async function GET() {
  try {
    const ranks: rankinfo[] = await prisma.$queryRaw`select * from ranking limit 50;`;
    const transformBigIntToNumber = (data: rankinfo[]) => {
        return data.map(item => ({
          rank: item.rank ? Number(item.rank) : 0,
          followers: item.followers ? Number(item.followers) : 0,
          likes: item.likes? Number(item.likes) : 0,
          user_id: item.user_id,
          username: item.username,
          streamedHours: item.streamedHours ? Number(item.streamedHours) : 0,
          score: Number(item.score),
          min: item.min,
        }));
    };

    const rankspre: rankinfo[] = await prisma.$queryRaw`With atts AS (
	SELECT
    U.user_id,
    (SELECT FLOOR(SUM(duration) / 3600) FROM Hours WHERE user_id = U.user_id AND played_at ) AS tstream,
    (SELECT COUNT(*) FROM follows WHERE user_id_b = U.user_id AND follow_at <= '2025-03-31' ) AS tfollows,
    (SELECT COUNT(*) FROM likes AS L JOIN songs AS S ON L.song_id = S.song_id WHERE S.user_id = U.user_id AND liked_at <= '2025-03-31' ) AS tlikes
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
    console.log('tranks in route: ',tranks)
    console.log('trankspre in route: ',trankspre)
    console.log('ranks in route: ',ranks)

    const infoarr : [string[]] = [[]];

    for(let i = 0; i < tranks.length; i ++)
    {
      const top3: genrelist[] = await prisma.$queryRaw
      `select genre, COUNT(*) AS 'count'
        from songs 
        where genre != '' AND user_id = ${tranks[i].user_id}
        group by genre
        ORDER by COUNT(*) DESC 
        Limit 3;`;
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
    };

    console.log('genre list: ',infoarr);

    return NextResponse.json({tranks, trankspre, infoarr})
  } catch (error:unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
