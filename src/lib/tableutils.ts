import { PDFPage, PDFFont } from 'pdf-lib';
import { rgb } from 'pdf-lib';

const rowHeight = 20; // Row height for each user
const colWidth = 162; // Column width

// Column positions (x-axis)
const col1X = 50;   // Column 1 (username)
const col2X = 212;  // Column 2 (email)

// Column headers
const headers = [
  { label: 'Username', x: col1X },
  { label: 'Email', x: col2X },
];

// Function to draw headers
export const drawHeaders = (page: PDFPage, yPosition: number, font: PDFFont) => {
  headers.forEach(header => {
    page.drawText(header.label, { x: header.x, y: yPosition, font, size: 12 });
    // Draw a line under the header
    page.drawLine({
      start: { x: header.x, y: yPosition - 2 },
      end: { x: header.x + colWidth, y: yPosition - 2 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  });
  return yPosition - rowHeight; // Move the yPosition down after drawing headers
};

// Function to draw user data rows
export const addUserDataToPage = (page: PDFPage, user: any, yPosition: number, font: PDFFont) => {
  // Truncate username if it's too long
  let username = user.username;
  if (username.length > 20) {
    username = username.substring(0, 20); // Truncate to 20 characters
  }

  // Draw cell for Username
  page.drawRectangle({
    x: col1X,
    y: yPosition - rowHeight + 2, // Adjust Y position to fit text
    width: colWidth,
    height: rowHeight - 4,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText(username, { x: col1X + 5, y: yPosition - rowHeight + 5, font, size: 12 });

  // Draw cell for Email
  page.drawRectangle({
    x: col2X,
    y: yPosition - rowHeight + 2,
    width: colWidth + 50,
    height: rowHeight - 4,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText(user.email, { x: col2X + 5, y: yPosition - rowHeight + 5, font, size: 12 });

  return yPosition - rowHeight; // Move the yPosition down after adding user data
};
