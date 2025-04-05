import { NextResponse } from 'next/server';
import { PrismaClient, streaming_history } from "@prisma/client";
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import * as fontkit from 'fontkit';
// Import utility functions for drawing the table
import { drawHeaders, addUserDataToPage, changearr } from '@/lib/tableutils';


const prisma = new PrismaClient();

interface User { email: string; role: string; user_id: number; username: string; created_at: Date; }

interface result {v: BigInt;}
interface treresult {v1: BigInt; v2: BigInt; v3: BigInt; v4: BigInt; v5: BigInt; v6: BigInt; }

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
    let totans: number[] = [0,0,0,0,0]
    let newans: number[] = [0,0,0,0,0]
    let growthans: number[] = [0,0,0,0,0]
;   let period : string = "'" + mappedArr[3] + "-" + subsection[0] + "-01' AND '" + mappedArr[4] + "-" + subsection[1] + "-" + subsection[2] + "'";
    
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
    
    page.drawText('At A Glance', {x: 253, y: 639, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', {x: 251, y: 639, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', {x: 251, y: 641, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', {x: 253, y: 641, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('At A Glance', { x: 252, y: 640,size: 20, });

    //table
    page.drawLine({ start: { x: 50, y: 480 }, end: { x: 562, y: 480 }, thickness: 3,});
    page.drawLine({ start: { x: 306, y: 620 }, end: { x: 306, y: 480 }, thickness: 3,});
    page.drawLine({ start: { x: 210, y: 340 }, end: { x: 210, y: 480 }, thickness: 3,});
    page.drawLine({ start: { x: 400, y: 340  }, end: { x:400, y: 480 }, thickness: 3,});
    //headers
    page.drawText('Listeners', { x:115, y: 600, font, size: 20, });
    page.drawLine({ start: { x: 113, y: 596 }, end: { x: 205, y: 596 }, thickness: 2,});
    page.drawText('Streaming Hours', { x:360, y: 600, font, size: 20, });
    page.drawLine({ start: { x: 358, y: 596 }, end: { x: 520, y: 596 }, thickness: 2,});
    page.drawText('Follows', { x:80, y: 450, font, size: 18, });
    page.drawLine({ start: { x: 78, y: 446 }, end: { x: 143, y: 446 }, thickness: 2,});
    page.drawText('Likes', { x:285, y: 450, font, size: 18, });
    page.drawLine({ start: { x: 283, y: 446 }, end: { x: 332, y: 446 }, thickness: 2,});
    page.drawText('Uploads', { x:460, y: 450, font, size: 18, });
    page.drawLine({ start: { x: 459, y: 446 }, end: { x: 527, y: 446 }, thickness: 2,});
    // filler
    const end: string = stringArr[0] == '' ?  mappedArr[2] : (mappedArr[0] == 'Year over Year' ? '2025': 'Q2');
    //Listeners
    page.drawText('Total by ' + end + ' – ' + totans[0], { x:102, y: 565, font, size: 14, });
    page.drawText('New users – ' + newans[0], { x:108, y: 535, font, size: 14, });
    page.drawText('Growth - ' + growthans[0] + '%', { x:112, y: 505, font, size: 14, });
    //Streaming Hours
    page.drawText('Total by ' + end + ' – ' + totans[1], { x:382, y: 565, font, size: 14, });
    page.drawText('New users – ' + newans[1], { x:388, y: 535, font, size: 14, });
    page.drawText('Growth - ' + growthans[1] + '%', { x:392, y: 505, font, size: 14, });
    //Follows
    page.drawText('Total by ' + end + ' – ' + totans[2], { x:54, y: 415, font, size: 14, });
    page.drawText('New users – ' + newans[2], { x:60, y: 385, font, size: 14, });
    page.drawText('Growth - ' + growthans[2] + '%', { x:64, y: 355, font, size: 14, });
    //Likes
    page.drawText('Total by ' + end + ' – ' + totans[3], { x:251, y: 415, font, size: 14, });
    page.drawText('New users – ' + newans[3], { x:257, y: 385, font, size: 14, });
    page.drawText('Growth - ' + growthans[3] + '%', { x:261, y: 355, font, size: 14, });
    //Uploads
    page.drawText('Total by ' + end + ' – ' + totans[4], { x:437, y: 415, font, size: 14, });
    page.drawText('New users – ' + newans[4], { x:443, y: 385, font, size: 14, });
    page.drawText('Growth - ' + growthans[4] + '%', { x:447, y: 355, font, size: 14, });


    page.drawText('Where we’re at', {x: 243, y: 309, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at', {x: 241, y: 311, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at', {x: 241, y: 309, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at', {x: 243, y: 311, size: 20, opacity: 0.25, color: rgb(252/255, 142/255, 246/255), });
    page.drawText('Where we’re at', { x: 242, y: 310,size: 20, });


    const todayqueries: string[] = [
      `SELECT count(user_id) as v FROM users WHERE role='listener';`,
      `SELECT count(DISTINCT user_id) as v FROM streaming_history;`,
      `SELECT count(like_id) as v FROM likes;`,
      `SELECT count(follow_id) as v FROM follows;`,
      `SELECT floor(sum(duration)/60) as v FROM hours;`,
      `SELECT count(song_id) as v FROM songs;`
    ];
    let todayans: number[] = [0,0,0,0,0,0]
    for (let i = 0; i < todayans.length; i++){
      const temp: result[] = await prisma.$queryRawUnsafe(todayqueries[i]);
      todayans[i] = Number(temp[0].v)
    }; 

    page.drawText('Total Listeners - ' + todayans[0], { x:70, y: 270, font, size: 18, });
    page.drawText('Active Listeners - ' + todayans[1], { x:340, y: 270, font, size: 18, });
    page.drawText('Likes - ' + todayans[2], { x:70, y: 245, font, size: 18, });
    page.drawText('Follows - ' + todayans[3], { x:340, y: 245, font, size: 18, });
    page.drawText('Streamed Hours - ' + todayans[4], { x:70, y: 220, font, size: 18, });
    page.drawText('Number of Songs - ' + todayans[5], { x:340, y: 220, font, size: 18, });

    //const relativeq: string[] = [``,``,``,``,``];

    const reltodayArr: [string[],string[],string[],string[],string[]] = 
    [['count(user_id)','users','created_at']//listeners
    ,['floor(sum(duration)/60)','hours','played_at']//streaminghours
    ,['count(follow_id)','follows','follow_at']//Follows
    ,['count(like_id)','likes','liked_at']//Likes
    ,['count(song_id)','songs','uploaded_at']//Uploads
    ];

    const relativenew : [number[],number[],number[],number[],number[]] = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
    for (let i = 0; i < reltodayArr.length; i++){
      const tempeq = `WITH counts AS (
        SELECT 
		    (SELECT ${reltodayArr[i][0]}
            FROM ${reltodayArr[i][1]}
            WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 1 AND 3) AS v1,
         (SELECT ${reltodayArr[i][0]} 
         FROM ${reltodayArr[i][1]}
         WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 4 AND 6) AS v2,
        (SELECT ${reltodayArr[i][0]} 
         FROM ${reltodayArr[i][1]}
         WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 7 AND 9) AS v3,
        (SELECT ${reltodayArr[i][0]} 
         FROM ${reltodayArr[i][1]}
         WHERE year(${reltodayArr[i][2]}) = 2024 AND month(${reltodayArr[i][2]}) BETWEEN 10 AND 12) AS v4,
         (SELECT ${reltodayArr[i][0]} 
         FROM ${reltodayArr[i][1]}
         WHERE year(${reltodayArr[i][2]}) = 2025 AND month(${reltodayArr[i][2]}) BETWEEN 1 AND 3) AS v5,
         (SELECT ${reltodayArr[i][0]} 
         FROM ${reltodayArr[i][1]}
         WHERE year(${reltodayArr[i][2]}) = 2025 AND month(${reltodayArr[i][2]}) BETWEEN 4 AND 6) AS v6
       )
      SELECT * FROM counts;
      `;
      const temp: treresult[] = await prisma.$queryRawUnsafe(tempeq);
      relativenew[i][0] = Number(temp[0].v1);
      relativenew[i][1] = Number(temp[0].v2);
      relativenew[i][2] = Number(temp[0].v3);
      relativenew[i][3] = Number(temp[0].v4);
      relativenew[i][4] = Number(temp[0].v5);
      relativenew[i][5] = Number(temp[0].v6);
      
    }
    console.log(relativenew);
    //Q1-2024,

    

    /*
    (Q2_count - Q1_count)/Q1_count * 100 AS 'Q2 - 2024 % Growth',
    (Q3_count - Q2_count)/Q2_count * 100 AS 'Q3 - 2024 % Growth',
    (Q4_count - Q3_count)/Q3_count * 100 AS 'Q4 - 2024 % Growth',
    (Q12_count - Q4_count)/Q4_count * 100 AS 'Q4 - 2025 % Growth',
    (Q22_count - Q12_count)/Q12_count * 100 AS 'Q4 - 2025 % Growth'
    */














    // User Log portion
    changearr(updatedArr);
    yPosition = drawHeaders(page, yPosition, font);
    // limits pages if blank
    let allFalse = false;
    for (let i = 0; i < updatedArr.length; i++)
    {
      //console.log(updatedArr[i]);
      if(updatedArr[i] === true) { allFalse = true;}
    };
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
      page = pdfDoc.addPage([612, 792]);
      const user = users[i];

      if (yPosition < 72) { // If there's not enough space on the current page, add a new one
        page = pdfDoc.addPage([612, 792]); // Add a new page
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
