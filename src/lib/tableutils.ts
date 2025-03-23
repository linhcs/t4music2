import { PDFPage, PDFFont } from 'pdf-lib';
import { rgb } from 'pdf-lib';

const rowHeight = 20; // Row height for each user

const columnwidths = [
  { label: 'Id', w: 30 },
  { label: 'Username', w: 122 },
  { label: 'Email', w: 192 },
  { label: 'role', w: 80 },
  { label: 'Created', w: 100 }
]
// Column positions (x-axis)
const col1X = 50;   // Column 1 (username) Start
const colw1 = 122;
const colw2 = 192;
const colw3 = 100;
const col2X = col1X + colw1;  // Column 2 (email)
const col3X = col2X + colw2;  // Column 2 (email)

// Column headers
const headers = [
  { label: 'Username', x: col1X },
  { label: 'Email', x: col2X },
  { label: 'Created', x: col3X },
];

// Function to draw headers
export const drawHeaders = (page: PDFPage, yPosition: number, font: PDFFont) => {
  headers.forEach(header => {
    page.drawText(header.label, { x: header.x, y: yPosition, font, size: 12 });
  });
  return yPosition; // Move the yPosition down after drawing headers
};

// Function to draw user data rows
export const addUserDataToPage = (page: PDFPage, user: any, yPosition: number, font: PDFFont) => {
  
  // Truncate username if it's too long
  let username = user.username;
  if (username.length > 20) {
    username = username.substring(0, 20); // Truncate to 20 characters
  }

  // Truncate email if it's too long
  let email = user.email;
  if (email.length > 25) {
    email = email.substring(0, 25); // Truncate to 20 characters
  }

  let created = user.created_at.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });


  // Draw cell for Username
  page.drawRectangle({
    x: col1X,
    y: yPosition - rowHeight - 4, // Adjust Y position to fit text
    width: colw1,
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText(username, { x: col1X + 5, y: yPosition - rowHeight, font, size: 12 });

  // Draw cell for Email
  page.drawRectangle({
    x: col2X,
    y: yPosition - rowHeight - 4,
    width: colw2,
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText(email, { x: col2X + 5, y: yPosition - rowHeight, font, size: 12 });

   // Draw cell for created
   page.drawRectangle({
    x: col3X,
    y: yPosition - rowHeight - 4,
    width: colw3,
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText(created, { x: col3X + 5, y: yPosition - rowHeight, font, size: 12 });

  return yPosition - rowHeight; // Move the yPosition down after adding user data
};
