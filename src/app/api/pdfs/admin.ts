import { PDFDocument } from 'pdf-lib';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a blank page to the document
    pdfDoc.addPage(); // Adds a blank page

    // Save the PDF as bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response with correct headers
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=blank_page.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
