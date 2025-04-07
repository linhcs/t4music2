import { NextResponse } from 'next/server';
import { PrismaClient} from "@prisma/client";
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import * as fontkit from 'fontkit';
// Import utility functions for drawing the table
import { drawHeaders, addUserDataToPage, changearr } from '@/lib/tableutils';


const prisma = new PrismaClient();

interface User { email: string; role: string; user_id: number; username: string; created_at: Date; };

interface result {v: bigint;};
interface idresult {id: number; name: string; min: string;};
interface genrelist{genre: string; count: bigint};
//interface treresult {v1: bigint; v2: bigint; v3: bigint; v4: bigint; v5: bigint; v6: bigint; };
interface artresult {id: number; name: string; f: bigint; l: bigint; sh: bigint};

function getCurrentDateFormatted(): string {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (1-12), and pad to ensure 2 digits
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

  return `${month}-${year}`;
}


export async function POST(req: Request) {
  try {

    const { updatedArr, stringArr } = await req.json();

    console.log('stringArr: ',stringArr);

    if(stringArr[0] == 'option11'){
      stringArr[1] = 'option21';
      stringArr[3] = 'option32';
      stringArr[2] = 'option44';
      stringArr[4] = 'option52';
    } else if (stringArr[0] == 'option12'){
      stringArr[1] = 'option21';
      stringArr[3] = 'option32';
      stringArr[2] = 'option42';
      stringArr[4] = 'option52';
    };

    console.log('stringArr new: ',stringArr);

    const maping: { [key: string]: string } = {
      'option11': 'Year over Year',
      'option12': 'Q1 to Q2 - 2025',
      'option21': 'Q1',
      'option22': 'Q2',
      'option23': 'Q3',
      'option24': 'Q4',
      'option31': '2024',
      'option32': '2025',
      'option41': 'Q1',
      'option42': 'Q2',
      'option43': 'Q3',
      'option44': 'Q4',
      'option51': '2024',
      'option52': '2025',
    };
    const mappedArr = stringArr.map((option: string) => option ? maping[option] : '');
    console.log("mappedArr",mappedArr);

    const noshot = "users";
    const rawquery = `SELECT * FROM ${noshot};`;
    // Query the database for some data
    const users: User[] = await prisma.$queryRawUnsafe(rawquery);
  
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a blank page to the PDF
    let page = pdfDoc.addPage([612, 792]); // letters size

    //runing ignore becasue it says its a problem but it works so idk
    //@ts-expect-error: this is not cuaisng issues typescript is just for lame lamos
    pdfDoc.registerFontkit(fontkit);
    //font
    const comicSansPath = path.resolve('public/fonts/comic.ttf');
    const comicSansBytes = fs.readFileSync(comicSansPath);
    const font = await pdfDoc.embedFont(comicSansBytes);
    const imagepath = path.resolve('public/even lighter.jpg');
    const imageBytes = fs.readFileSync(imagepath);
    const image = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(image);

    let yPosition = 720;
    
    //logo
    const gradientColors = [
      rgb(0, 153/255, 255/255),
      rgb(167/255, 0/255, 209/255),
      rgb(252/255, 142/255, 246/255),
      rgb(0, 0, 0),
    ];
    for (let i = 0; i < gradientColors.length; i++) {
      page.drawText('Amplifi', {
        x: 44 - (i * 2),
        y: yPosition - 30 + (i * 2),
        size: 80,
        opacity: 0.4 + (i * .15),
        color: gradientColors[i], 
      });
    };
    
    //Period declaration
    if(stringArr[0] == '')
    {
      page.drawText('Start', { x:310, y: yPosition, font, size: 20, });
      page.drawText('End', { x: 470, y: yPosition, font, size: 20, });
      page.drawText(mappedArr[1] + ' - ' + mappedArr[3], { x: 310, y: yPosition - 25, font, size: 16, });
      page.drawText(mappedArr[2] + ' - ' + mappedArr[4], { x: 470, y: yPosition - 25, font, size: 16, });
      const arrowpath = 'M30 50 L70 50 M60 45 L75 50 L60 55';
      page.drawSvgPath(arrowpath, { color: rgb(0, 0, 0), x:370, y: yPosition + 47, borderWidth:5, });
    }
    else
    {
      page.drawText(mappedArr[0], { x:330, y: yPosition-5, font, size: 25, });
    };

    
    const startmap: { [key: string]: string } = {
      'option21': '01',
      'option22': '04',
      'option23': '07',
      'option24': '10',
      'option41': '03',
      'option42': '06',
      'option43': '09',
      'option44': '12',
    };
    const edaymap: { [key: string]: string } = {
      'option41': '31',
      'option42': '30',
      'option43': '30',
      'option44': '31',
    };

    const pt1 : string[] = [stringArr[1],stringArr[2]].map((option: string) => option ? startmap[option] : '');
    const pt2 : string[]= [stringArr[2]].map((option: string) => option ? edaymap[option] : '');
    const subsection : string[] = [ ...pt1, ...pt2]
    console.log('subsection: ',subsection)

    const tottablearr: [string[],string[],string[],string[],string[]] = 
    [['count(user_id) as v','users','created_at','AND role = "listener"']//listeners
    ,['floor(sum(duration)/60) as v','Hours','played_at','']//streaminghours
    ,['count(follow_id) as v','follows','follow_at','']//Follows
    ,['count(like_id) as v','likes','liked_at','']//Likes
    ,['count(song_id) as v','songs','uploaded_at','']//Uploads
    ];
    const totans: number[] = [0,0,0,0,0]
    const newans: number[] = [0,0,0,0,0]
    const growthans: number[] = [0,0,0,0,0]
;   const period : string = "'" + mappedArr[3] + "-" + subsection[0] + "-01' AND '" + mappedArr[4] + "-" + subsection[1] + "-" + subsection[2] + "'";
    
    if(mappedArr[0] == 'y') {
      for (let i = 0; i < totans.length; i++){
        tottablearr[i][2] = 'year(' + tottablearr[i][2] + ')'

        for (let i = 0; i < totans.length; i++){
          const tablequeries =`SELECT ${tottablearr[i][0]} from ${tottablearr[i][1]} WHERE ${tottablearr[i][2]} <= 2025 ${tottablearr[i][3 ]};`;
          const temp: result[] = await prisma.$queryRawUnsafe(tablequeries);
          totans[i] = Number(temp[0].v)
        };
        console.log("totans: ",totans)
        for (let i = 0; i < newans.length; i++){
          const tablequeries =`SELECT ${tottablearr[i][0]} from ${tottablearr[i][1]} WHERE ${tottablearr[i][2]} BETWEEN 2024 AND 2025 ${tottablearr[i][3 ]};`;
          const temp: result[] = await prisma.$queryRawUnsafe(tablequeries);
          newans[i] = Number(temp[0].v)
        };  
        console.log("newans: ",newans)
        for (let i = 0; i < growthans.length; i++){
          growthans[i] = (totans[i] == newans[i]? 0 : Math.floor((totans[i] - newans[i])/newans[i] * 100))
        };
        console.log("growthans: ",growthans)
        
      };
    } else {

      for (let i = 0; i < totans.length; i++){
        const tablequeries =`SELECT ${tottablearr[i][0]} from ${tottablearr[i][1]} WHERE ${tottablearr[i][2]} < '${mappedArr[4]}-${subsection[1]}-${subsection[2]}' ${tottablearr[i][3 ]};`;
        const temp: result[] = await prisma.$queryRawUnsafe(tablequeries);
        totans[i] = Number(temp[0].v)
      };
      console.log("totans: ",newans)
      for (let i = 0; i < updatedArr.length; i++){
        const tablequeries =`SELECT ${tottablearr[i][0]} from ${tottablearr[i][1]} WHERE ${tottablearr[i][2]} BETWEEN ${period}${tottablearr[i][3 ]};`;
        const temp: result[] = await prisma.$queryRawUnsafe(tablequeries);
        newans[i] = Number(temp[0].v)
      };  
      console.log("newans: ",newans)
      for (let i = 0; i < growthans.length; i++){
        growthans[i] = (totans[i] == newans[i]? 0 : Math.floor((totans[i] - newans[i])/newans[i] * 100))
      };
      console.log("growthans: ",growthans)

    };
    
    page.drawText('At A Glance', {x: 243, y: 619, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', {x: 241, y: 619, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', {x: 241, y: 621, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', {x: 243, y: 621, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', { x: 242, y: 620,size: 22, });

    //table
    page.drawLine({ start: { x: 50, y: 450 }, end: { x: 562, y: 450 }, thickness: 3,});
    page.drawLine({ start: { x: 306, y: 590 }, end: { x: 306, y: 450 }, thickness: 3,});
    page.drawLine({ start: { x: 210, y: 310 }, end: { x: 210, y: 450 }, thickness: 3,});
    page.drawLine({ start: { x: 400, y: 310  }, end: { x:400, y: 450 }, thickness: 3,});
    //headers
    page.drawText('Listeners', { x:115, y: 570, font, size: 20, });
    page.drawLine({ start: { x: 113, y: 566 }, end: { x: 205, y: 566 }, thickness: 2,});
    page.drawText('Streaming Hours', { x:360, y: 570, font, size: 20, });
    page.drawLine({ start: { x: 358, y: 566 }, end: { x: 520, y: 566 }, thickness: 2,});
    page.drawText('Follows', { x:80, y: 410, font, size: 18, });
    page.drawLine({ start: { x: 78, y: 406 }, end: { x: 143, y: 406 }, thickness: 2,});
    page.drawText('Likes', { x:285, y: 410, font, size: 18, });
    page.drawLine({ start: { x: 283, y: 406 }, end: { x: 332, y: 406 }, thickness: 2,});
    page.drawText('Uploads', { x:460, y: 410, font, size: 18, });
    page.drawLine({ start: { x: 459, y: 406 }, end: { x: 527, y: 406 }, thickness: 2,});
    // filler
    const end: string = stringArr[0] == '' ?  mappedArr[2] : (mappedArr[0] == 'Year over Year' ? '2025': 'Q2');
    //Listeners
    page.drawText('Total by ' + end + ' – ' + totans[0], { x:102, y: 535, font, size: 14, });
    page.drawText('New users – ' + newans[0], { x:108, y: 505, font, size: 14, });
    page.drawText('Growth - ' + growthans[0] + '%', { x:112, y: 475, font, size: 14, });
    //Streaming Hours
    page.drawText('Total by ' + end + ' – ' + totans[1], { x:382, y: 535, font, size: 14, });
    page.drawText('New users – ' + newans[1], { x:388, y: 505, font, size: 14, });
    page.drawText('Growth - ' + growthans[1] + '%', { x:392, y: 475, font, size: 14, });
    //Follows
    page.drawText('Total by ' + end + ' – ' + totans[2], { x:54, y: 375, font, size: 14, });
    page.drawText('New users – ' + newans[2], { x:60, y: 335, font, size: 14, });
    page.drawText('Growth - ' + growthans[2] + '%', { x:64, y: 295, font, size: 14, });
    //Likes
    page.drawText('Total by ' + end + ' – ' + totans[3], { x:251, y: 375, font, size: 14, });
    page.drawText('New users – ' + newans[3], { x:257, y: 335, font, size: 14, });
    page.drawText('Growth - ' + growthans[3] + '%', { x:261, y: 295, font, size: 14, });
    //Uploads
    page.drawText('Total by ' + end + ' – ' + totans[4], { x:437, y: 375, font, size: 14, });
    page.drawText('New users – ' + newans[4], { x:443, y: 335, font, size: 14, });
    page.drawText('Growth - ' + growthans[4] + '%', { x:447, y: 295, font, size: 14, });

    const currentDate = getCurrentDateFormatted();

    page.drawText('Where we’re at Today ' + currentDate, {x: 163, y: 229, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at Today ' + currentDate, {x: 161, y: 231, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at Today ' + currentDate, {x: 161, y: 229, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at Today ' + currentDate, {x: 163, y: 231, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at Today ' + currentDate, { x: 162, y: 230,size: 22, });


    const todayqueries: string[] = [
      `SELECT count(user_id) as v FROM users WHERE role='listener';`,
      `SELECT count(DISTINCT user_id) as v FROM streaming_history WHERE year(played_at) = 2025 AND month(played_at) > 2;`,
      `SELECT count(like_id) as v FROM likes;`,
      `SELECT count(follow_id) as v FROM follows;`,
      `SELECT floor(sum(duration)/60) as v FROM hours;`,
      `SELECT count(song_id) as v FROM songs;`
    ];
    const todayans: number[] = [0,0,0,0,0,0]
    for (let i = 0; i < todayans.length; i++){
      const temp: result[] = await prisma.$queryRawUnsafe(todayqueries[i]);
      todayans[i] = Number(temp[0].v)
    }; 

    page.drawText('Total Listeners - ' + todayans[0], { x:70, y: 170, font, size: 18, });
    page.drawText('Active Listeners - ' + todayans[1], { x:340, y: 170, font, size: 18, });
    page.drawText('Likes - ' + todayans[2], { x:70, y: 110, font, size: 18, });
    page.drawText('Follows - ' + todayans[3], { x:340, y: 110, font, size: 18, });
    page.drawText('Streamed Hours - ' + todayans[4], { x:70, y: 50, font, size: 18, });
    page.drawText('Number of Songs - ' + todayans[5], { x:340, y: 50, font, size: 18, });

    //page 2 start
    page = pdfDoc.addPage([612, 792]);
    page.drawImage(image);

    page.drawText('Our Artists', {x: 253, y: 729, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Our Artists', {x: 251, y: 731, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Our Artists', {x: 251, y: 729, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Our Artists', {x: 253, y: 731, size: 22, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Our Artists', { x: 252, y: 730,size: 22, });

    page.drawText('Top Artists', { x: 60, y: 710,size: 20, });
    page.drawRectangle({ x: 50, y: 640, width: 512, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Total by ' + end, { x:76, y: 650, font, size: 14, });
    page.drawRectangle({ x: 50, y: 610, width: 512, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('New users', { x:80, y: 620, font, size: 14, });
    page.drawRectangle({ x: 50, y: 580, width: 512, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Growth %', { x:82, y: 590, font, size: 14, });
    page.drawRectangle({ x: 178, y: 580, width: 118, height: 120, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Follows', { x:212, y: 680, font, size: 14, });
    page.drawRectangle({ x: 296, y: 580, width: 88, height: 120, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Likes', { x:324, y: 680, font, size: 14, });
    page.drawRectangle({ x: 384, y: 580, width: 178, height: 120, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Streaming Hours', { x:416, y: 680, font, size: 14, });

    const totalart = `With atts AS (
                      Select
                        DISTINCT S.user_id,
                        U.username,
                        count(F.user_id_b) as tfollows,
                        count(L.song_id) as tlikes,
                        floor(sum(H.duration)/3600) as tstream
                      FROM songs as S
                        LEFT JOIN follows as F on F.user_id_b = S.user_id
                        LEFT JOIN likes as L on L.song_id = S.song_id AND S.uploaded_at < '${mappedArr[4]}-${subsection[1]}-${subsection[2]}'
                        LEFT JOIN Hours as H ON H.song_id = S.song_id AND H.played_at < '${mappedArr[4]}-${subsection[1]}-${subsection[2]}'
                        Left JOIN users as U on S.user_id = U.user_id AND U.created_at < '${mappedArr[4]}-${subsection[1]}-${subsection[2]}'
                        Group by S.user_id    
                      )
                      SELECT 
                        user_id as 'id',
                        username as 'name',
                        tfollows as 'f',
                        tlikes as 'l',
                        tstream as 'sh'
                      from atts;`;
    const newart = `With atts AS (
                      Select
                        S.user_id,
                        U.username,
                        count(F.user_id_b) as tfollows,
                        count(L.song_id) as tlikes,
                        floor(sum(H.duration)/3600) as tstream
                      FROM songs as S
                        LEFT JOIN follows as F on F.user_id_b = S.user_id
                        LEFT JOIN likes as L on L.song_id = S.song_id AND S.uploaded_at BETWEEN ${period}
                        LEFT JOIN Hours as H ON H.song_id = S.song_id AND H.played_at BETWEEN ${period}
                        Left JOIN users as U on S.user_id = U.user_id AND U.created_at BETWEEN ${period}
                        Group by S.user_id    
                      )
                      SELECT 
                        tfollows as 'f',
                        tlikes as 'l',
                        tstream as 'sh'
                      from atts;`;
    // artist name
    const topinfo: artresult[] = await prisma.$queryRawUnsafe(totalart);
    const topnewinfo: artresult[] = await prisma.$queryRawUnsafe(newart);
    for(let i = 0; i < topnewinfo.length; i ++)
    {
      if(topinfo[i].name === null){topinfo[i].name = 'Na'}
    }
    console.log('topinfo: ', topinfo);
    console.log('topnewinfo: ', topnewinfo);
    page.drawText(topinfo[0].name.slice(0,9), { x: 60, y: 680,size: 20, font,});
    page.drawText('' + Number(topinfo[0].f), { x: 228, y: 650,size: 20, font,});
    page.drawText('' + Number(topinfo[0].l), { x: 330, y: 650,size: 20, font,});
    page.drawText( Number(topinfo[0].sh) + ' hours', { x: 430, y: 650,size: 20, font,});
    page.drawText('' + Number(topnewinfo[0].f), { x: 228, y: 620,size: 20, font,});
    page.drawText('' + Number(topnewinfo[0].l), { x: 330, y: 620,size: 20, font,});
    page.drawText( Number(topnewinfo[0].sh) + ' hours', { x: 430, y: 620,size: 20, font,});
    page.drawText((Number(topnewinfo[0].f) == 0 ? 0 : Math.floor((Number(topinfo[0].f) - Number(topnewinfo[0].f))/Number(topnewinfo[0].f) * 100)) + ' %', { x: 220, y: 590,size: 20, font,});
    page.drawText((Number(topnewinfo[0].l) == 0 ? 0 : Math.floor((Number(topinfo[0].l) - Number(topnewinfo[0].l))/Number(topnewinfo[0].l)) * 100) + ' %', { x: 330, y: 590,size: 20, font,});
    page.drawText((Number(topnewinfo[0].sh) == 0 ? 0 : Math.floor((Number(topinfo[0].sh) - Number(topnewinfo[0].sh))/Number(topnewinfo[0].sh)) * 100) + ' %', { x: 460, y: 590,size: 20, font,});
    
    const s = 180;
    //Average artist
    page.drawText('Average Artists', { x: 60, y: 710 - s,size: 20, });
    page.drawRectangle({ x: 50, y: 640 - s, width: 512, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Total by ' + end, { x:76, y: 650 - s, font, size: 14, });
    page.drawRectangle({ x: 50, y: 610 - s, width: 512, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('New users', { x:80, y: 620 - s, font, size: 14, });
    page.drawRectangle({ x: 50, y: 580 - s, width: 512, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Growth %', { x:82, y: 590 - s, font, size: 14, });
    page.drawRectangle({ x: 178, y: 580 - s, width: 118, height: 120, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Follows', { x:212, y: 680 - s, font, size: 14, });
    page.drawRectangle({ x: 296, y: 580 - s, width: 88, height: 120, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Likes', { x:324, y: 680 - s, font, size: 14, });
    page.drawRectangle({ x: 384, y: 580 - s, width: 178, height: 120, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Streaming Hours', { x:416, y: 680 - s, font, size: 14, });

    const medianart = Math.ceil(topinfo.length/2) - 1;
    page.drawText(topinfo[medianart].name.slice(0,9), { x: 60, y: 680 - s,size: 20, font,});
    page.drawText('' + Number(topinfo[medianart].f), { x: 228, y: 650 - s,size: 20, font,});
    page.drawText('' + Number(topinfo[medianart].l), { x: 330, y: 650 - s,size: 20, font,});
    page.drawText( Number(topinfo[medianart].sh) + ' hours', { x: 430, y: 650 - s,size: 20, font,});
    page.drawText('' + Number(topnewinfo[medianart].f), { x: 228, y: 620 - s,size: 20, font,});
    page.drawText('' + Number(topnewinfo[medianart].l), { x: 330, y: 620 - s,size: 20, font,});
    page.drawText( Number(topnewinfo[medianart].sh) + ' hours', { x: 430, y: 620 - s,size: 20, font,});
    page.drawText((Number(topnewinfo[medianart].f) == 0 ? 0 : Math.floor((Number(topinfo[medianart].f) - Number(topnewinfo[medianart].f))/Number(topnewinfo[medianart].f) * 100)) + ' %', { x: 220, y: 590 - s,size: 20, font,});
    page.drawText((Number(topnewinfo[medianart].l) == 0 ? 0 : Math.floor((Number(topinfo[medianart].l) - Number(topnewinfo[medianart].l))/Number(topnewinfo[medianart].l)) * 100) + ' %', { x: 330, y: 590 - s,size: 20, font,});
    page.drawText((Number(topnewinfo[medianart].sh) == 0 ? 0 : Math.floor((Number(topinfo[medianart].sh) - Number(topnewinfo[medianart].sh))/Number(topnewinfo[medianart].sh)) * 100) + ' %', { x: 460, y: 590 - s,size: 20, font,});

    page.drawText('Artists by Genre Today ' + currentDate, { x: 60, y: 350,size: 20, });

    const infoarr : [string[]] = [[]];
    const genereid: idresult[] = await prisma.$queryRaw`select distinct user_id as id, username as name, min from ranking limit 50;`;
    for(let i = 0; i < genereid.length; i ++)
    {
      const top3: genrelist[] = await prisma.$queryRaw
      `select genre, COUNT(*) AS 'count'
        from songs 
        where genre != '' AND user_id = ${genereid[i].id}
        group by genre
        ORDER by COUNT(*) DESC 
        Limit 3;`;
      const temp : string[] = [top3[0].genre];
      for(let j = 1; j < top3.length; j++)
      {
        if(Number(top3[j].count) > 4){temp.push(top3[j].genre)};
      }
      infoarr.push(temp);
    };
    console.log('genereid: ',genereid);
    console.log('infoarr: ',infoarr);

    const genereprinted : boolean[] = [false, false, false, false, false, false, false, false];
    const generetype : string[] = ['Pop', 'Hip-hop', 'Rap', 'R&B', 'Rock', 'Counrty', 'EDM', 'Jazz'];
    const genrelocation : number[] = [284, 252, 220, 188, 156, 124, 92, 60];
    const response : string[] = ['They need more Followers','They need more Likes','They need more Streaming Hours'];
    
    for(let i = 1; i < infoarr.length; i++)
    {
      for(let j = 0; j < infoarr[i].length; j ++)
      {
        for(let k = 0; k < 8; k++) // triple for loop . . . this just seems wrong right xD
        {
          //
          if(infoarr[i][j] == generetype[k] && !genereprinted[k]){
            page.drawText(genereid[i-1].name, { x:60, y: genrelocation[k], font, size: 14, });
            page.drawText(' ' + i, { x:165, y: genrelocation[k], font, size: 14, });
            const temp : number = (genereid[i-1].min == 'follows' ? 0 :(genereid[i-1].min == 'likes'? 1 : 2));
            page.drawText(response[temp], { x:320, y: genrelocation[k], font, size: 14, });
            genereprinted[k] = true;
          };
        };
      };
    };
    for(let i = 0; i < 8; i ++)
    {
      if(!genereprinted[i])
      {
        page.drawText('None so Far!', { x:60, y: genrelocation[i], font, size: 14, });
        page.drawText('Na', { x:165, y: genrelocation[i], font, size: 14, });
      }
    };


    page.drawRectangle({ x: 50, y: 50, width: 512, height: 288, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawRectangle({ x: 50, y: 82, width: 512, height: 32, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawRectangle({ x: 50, y: 146, width: 512, height: 32, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawRectangle({ x: 50, y: 210, width: 512, height: 32, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawRectangle({ x: 50, y: 274, width: 512, height: 32, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawRectangle({ x: 150, y: 50, width: 50, height: 288, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawRectangle({ x: 200, y: 50, width: 100, height: 288, borderWidth: 1, borderColor: rgb(0, 0, 0),});
    page.drawText('Name', { x:82, y: 316, font, size: 14, });
    page.drawText('Rank', { x:160, y: 316, font, size: 14, });
    page.drawText('Genre', { x:230, y: 316, font, size: 14, });
    page.drawText('What they need to work on', { x:310, y: 316, font, size: 14, });
    page.drawText('Pop', { x:234, y: 284, font, size: 14, });
    page.drawText('Hip-hop', { x:226, y: 252, font, size: 14, });
    page.drawText('Rap', { x:234, y: 220, font, size: 14, });
    page.drawText('R&B', { x:234, y: 188, font, size: 14, });
    page.drawText('Rock', { x:232, y: 156, font, size: 14, });
    page.drawText('Counrty', { x:226, y: 124, font, size: 14, });
    page.drawText('EDM', { x:234, y: 92, font, size: 14, });
    page.drawText('Jazz', { x:232, y: 60, font, size: 14, });

    //This was code that I started working on
    // const reltodayArr: [string[],string[],string[],string[],string[]] = 
    // [['count(user_id)','users','created_at']//listeners
    // ,['floor(sum(duration)/60)','hours','played_at']//streaminghours
    // ,['count(follow_id)','follows','follow_at']//Follows
    // ,['count(like_id)','likes','liked_at']//Likes
    // ,['count(song_id)','songs','uploaded_at']//Uploads
    // ];
    // const relativenew : [number[],number[],number[],number[],number[]] = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
    // for (let i = 0; i < reltodayArr.length; i++){
    //   const tempeq = `WITH counts AS (
    //     SELECT 
		//     (SELECT ${reltodayArr[i][0]}
    //         FROM ${reltodayArr[i][1]}
    //         WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 1 AND 3) AS v1,
    //      (SELECT ${reltodayArr[i][0]} 
    //      FROM ${reltodayArr[i][1]}
    //      WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 4 AND 6) AS v2,
    //     (SELECT ${reltodayArr[i][0]} 
    //      FROM ${reltodayArr[i][1]}
    //      WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 7 AND 9) AS v3,
    //     (SELECT ${reltodayArr[i][0]} 
    //      FROM ${reltodayArr[i][1]}
    //      WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 10 AND 12) AS v4,
    //      (SELECT ${reltodayArr[i][0]} 
    //      FROM ${reltodayArr[i][1]}
    //      WHERE year(${reltodayArr[i][2]}) = 2025 AND month(${reltodayArr[i][2]}) BETWEEN 1 AND 3) AS v5,
    //      (SELECT ${reltodayArr[i][0]} 
    //      FROM ${reltodayArr[i][1]}
    //      WHERE year(${reltodayArr[i][2]}) = 2025 AND month(${reltodayArr[i][2]}) BETWEEN 4 AND 6) AS v6
    //    )
    //   SELECT * FROM counts;
    //   `;
    //   const temp: treresult[] = await prisma.$queryRawUnsafe(tempeq);
    //   relativenew[i][0] = Number(temp[0].v1);
    //   relativenew[i][1] = Number(temp[0].v2);
    //   relativenew[i][2] = Number(temp[0].v3);
    //   relativenew[i][3] = Number(temp[0].v4);
    //   relativenew[i][4] = Number(temp[0].v5);
    //   relativenew[i][5] = Number(temp[0].v6);
      
    // }
    // console.log(relativenew);


    // User Log portion
    changearr(updatedArr);
    // limits pages if blank
    let allFalse = false;
    for (let i = 0; i < updatedArr.length; i++)
    {
      //console.log(updatedArr[i]);
      if(updatedArr[i] === true) { allFalse = true;}
    };
    let firstpage = true;
    for (let i = 0; i < users.length; i++) {
      if(!allFalse){
        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=generated.pdf',
          },
        });
      };
      if(firstpage)
      {
        page = pdfDoc.addPage([612, 792]);
        page.drawImage(image);
        yPosition = drawHeaders(page, yPosition, font);
        firstpage = false;
      };
      const user = users[i];

      if (yPosition < 72) { // If there's not enough space on the current page, add a new one
        page = pdfDoc.addPage([612, 792]);
        page.drawImage(image);
        yPosition = 720; // Reset position for the new page
        // Draw headers again on the new page
        yPosition = drawHeaders(page, yPosition, font);
      }

      // Add user data to the page
      yPosition = addUserDataToPage(page, user, yPosition, font);
    }

    // Serialize the document to bytes (Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response with headers for a PDF download
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=generated.pdf',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
