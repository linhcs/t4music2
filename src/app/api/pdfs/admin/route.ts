import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import * as fontkit from 'fontkit';

const prisma = new PrismaClient();

// Define column widths
const col1X = 50;   // Column 2 (username, cut off at 212px)
const col2X = 212;   // Column 3 (email)
const rowHeight = 20; // Row height for each user

// Column headers
const headers = [
{ label: 'Username', x: col1X },
{ label: 'Email', x: col2X },
];

export async function GET() {
  try {
    
    // Query the database for some data
    const users = await prisma.users.findMany();
    if (!users || users.length === 0) {
      return new NextResponse('No users found in the database', { status: 404 });
    }

    const pageSize = 10;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a blank page to the PDF
    let page = pdfDoc.addPage([612, 792]); // letters size

    //runing ignore becasue it says its a problem but it works so idk
    //@ts-ignore
    pdfDoc.registerFontkit(fontkit);
    //font
    const comicSansPath = path.resolve('public/fonts/comic.ttf');
    const comicSansBytes = fs.readFileSync(comicSansPath);
    const font = await pdfDoc.embedFont(comicSansBytes);


    let yPosition = 720;

    // Function to draw the headers
    const drawHeaders = (page: any, yPosition: number, font: any) => {
      headers.forEach(header => {
        page.drawText(header.label, { x: header.x, y: yPosition, font, size: 12 });
      });
      return yPosition - rowHeight; // Move the yPosition down after drawing headers
    };

    // Draw headers on the page
    yPosition = drawHeaders(page, yPosition, font);

    // Function to add user data to the page
    const addUserDataToPage = (user: any) => {
      // Truncate username if it's too long
      let username = user.username;
      if (username.length > 20) {
        username = username.substring(0, 20); // Truncate to 20 characters
      }
      page.drawText(username, { x: col1X, y: yPosition, font, size: 12 });

      page.drawText(user.email, { x: col2X, y: yPosition, font, size: 12 });
      return yPosition - rowHeight; // Move the yPosition down after adding user data
    };

    // Loop through users and add them to the PDF
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (yPosition < 72) { // If there's not enough space on the current page, add a new one
        page = pdfDoc.addPage([612, 792]); // Add a new page
        yPosition = 720; // Reset position for the new page
        // Draw headers again on the new page
        yPosition = drawHeaders(page, yPosition, font);
      }

      // Add user data to the page
      yPosition = addUserDataToPage(user);
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
