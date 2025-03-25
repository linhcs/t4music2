import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import * as fontkit from 'fontkit';
import { drawFanHeaders, addFanDataToPage } from '@/lib/tableutils';

const prisma = new PrismaClient();

interface follows {username: string; follow_at: Date; }

export async function GET(req: Request) {
  try {

    const { username } : { username : string }  = await req.json();

    const artistid: number[] = await prisma.$queryRaw`SELECT user_id FROM users WHERE username = ${username};`;
    const followers: follows[] = await prisma.$queryRaw`
    SELECT u.username, f.follow_at
    FROM follows AS f, users AS u 
    WHERE u.user_id = user_id_b AND f.user_id_a = ${artistid[0]};`;
  
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

    yPosition = drawFanHeaders(page, yPosition, font);

    for (let i = 0; i < followers.length; i++) {
      const fan = followers[i];

      if (yPosition < 72) { // If there's not enough space on the current page, add a new one
        page = pdfDoc.addPage([612, 792]); // Add a new page
        yPosition = 720; // Reset position for the new page
        // Draw headers again on the new page
        yPosition = drawFanHeaders(page, yPosition, font);
      }

      // Add user data to the page
      yPosition = addFanDataToPage(page, fan, yPosition, font);
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
