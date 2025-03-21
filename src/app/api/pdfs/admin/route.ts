import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function GET() {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a blank page to the PDF
    const page = pdfDoc.addPage([600, 400]); // 600x400 is the size of the page
    const { height } = page.getSize();

    
    // Add text to the page
    const text = 'Hello, this is a blank PDF generated using pdf-lib!';
    page.drawText(text, { x: 50, y: height - 50});

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
