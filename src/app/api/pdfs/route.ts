import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument } from 'pdf-lib';
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma client
const prisma = new PrismaClient();

const generatePDF = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Query database with Prisma (fetching all users for example)
    const users = await prisma.users.findMany(); // Adjust to your actual schema

    // Create a new PDF document using PDF-lib
    const pdfDoc = await PDFDocument.create();

    // Add a page to the PDF
    const page = pdfDoc.addPage([600, 400]);

    // Embed a font (you can use other fonts as well)
    const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

    // Position and draw the text from the database
    const yPosition = 350;
    users.forEach((user, index) => {
      page.drawText(`User ${index + 1}: ${user.name}`, {
        x: 50,
        y: yPosition - 20 * index,
        font,
        size: 12,
      });
    });

    // Save the PDF as bytes
    const pdfBytes = await pdfDoc.save();

    // Set the headers to trigger a file download in the browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');

    // Send the PDF to the client
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate PDF' });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection after usage
  }
};

export default generatePDF;