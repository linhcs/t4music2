import { PDFPage, PDFFont } from 'pdf-lib';
import { rgb } from 'pdf-lib';


const columnwidthsobj = [
  { label: 'Id', w: 30 },
  { label: 'Username', w: 122 },
  { label: 'Email', w: 192 },
  { label: 'role', w: 80 },
  { label: 'Created', w: 100 }
];

interface User { email: string; role: string; user_id: number; username: string; created_at: Date; }
interface follower {username: string; follow_at: Date; }
const rowHeight = 20; // Row height for each user
const start = 44;

let colreference: number[] = [];
let colwidths: number[] = [0,0,0,0,0];
let colpos: number[] =[start];
let colheaders: string[] = [];

let passedarray = [true, true, true, true, true];

export const changearr = (array: boolean[]) =>{
  passedarray = array;
}

function Arrayprep(passedarray: boolean[]){
  //creates an array that tell you the indexes of the passed array
  //example if passed array is [f,t,t,f,t] column reference will be [1,2,4]
  colreference = [];
  for (let i = 0; i < passedarray.length; i++) {
    if(passedarray[i]){colreference.push(i);};  
  };
  //tell the withs fo the collumns
  //based on the last example it is [122,192,100,0,0]
  colwidths = [0,0,0,0,0];
  for (let i = 0; i < colreference.length; i++) {
      colwidths[i] = columnwidthsobj[colreference[i]].w;
  };
  colpos  =[start];
  for (let i = 0; i < colwidths.length; i++) {
    colpos.push(colpos[i] + colwidths[i]); 
  };
  colheaders = [];
  //makes an array of collumn headers
  const tcolheaders: string[] = colreference.map((index) => columnwidthsobj[index].label);
  colheaders = tcolheaders;
};


// Function to draw headers
export const drawHeaders = (page: PDFPage, yPosition: number, font: PDFFont) => {

  Arrayprep(passedarray);

  // Iterate through the colheaders and draw each one
  colheaders.forEach((header, index) => {
    // Use colWidths[index] as the x position for each header
    page.drawText(header, { 
      x: colpos[index] + 7, // The x position based on the column width
      y: yPosition, 
      font, 
      size: 12 
    });
  });

  return yPosition; // Return the yPosition after drawing the headers
};

// Function to draw user data rows
export const addUserDataToPage = (page: PDFPage, user: User, yPosition: number, font: PDFFont) => {

  Arrayprep(passedarray);

  for (let i = 0; i < colheaders.length; i++) {
    page.drawRectangle({
      x: colpos[i],
      y: yPosition - rowHeight - 4, // Adjust Y position to fit text
      width: colwidths[i],
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  };

  let render = 0;
  
  if(passedarray[0]){
    page.drawText(user.user_id + '', { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
    render +=1;
  };
  if(passedarray[1]){
    // Truncate username if it's too long
    let username = user.username;
    if (username.length > 20) {
      username = username.substring(0, 20); // Truncate to 20 characters
    }
    // draw
    page.drawText(username, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
    render +=1;
  };
  if(passedarray[2]){
    // Truncate email if it's too long
    let email = user.email;
    if (email.length > 25) {
      email = email.substring(0, 25); // Truncate to 20 characters
    }
    //draw
    page.drawText(email, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
    render +=1;
  };
  if(passedarray[3]){
    page.drawText(user.role, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
    render +=1;
  };
  if(passedarray[4] && user.created_at != null){
    //convert to date
    const created = user.created_at.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    //draw
    page.drawText(created, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
    render +=1;
  };

  return yPosition - rowHeight; // Move the yPosition down after adding user data
};

export const drawFanHeaders = (page: PDFPage, yPosition: number, font: PDFFont) => {
  page.drawText('Usernames', { x: start + 7, y: yPosition - rowHeight, font, size: 12 });
  page.drawText('Follow Date', { x: start + 122 + 7, y: yPosition - rowHeight, font, size: 12 });
  return yPosition; // Return the yPosition after drawing the headers
};

// Function to draw fans data rows
export const addFanDataToPage = (page: PDFPage, fan: follower, yPosition: number, font: PDFFont) => {

  const eff = [start, 122 + start];
  const eff2 = [122, 100];
  for (let i = 0; i < 2; i++) {
    page.drawRectangle({
      x: eff[i],
      y: yPosition - rowHeight - 4, // Adjust Y position to fit text
      width: eff2[i],
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  };

  page.drawText(fan.username, { x: start + 7, y: yPosition - rowHeight, font, size: 12 });
  const follow_time = fan.follow_at.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  page.drawText(follow_time, { x: start + 122 + 7, y: yPosition - rowHeight, font, size: 12 });

  // let render = 0;
  // if(passedarray[0]){
  //   render +=1;
  // };
  // if(passedarray[1]){
  //   // Truncate username if it's too long
  //   let username = user.username;
  //   if (username.length > 20) {
  //     username = username.substring(0, 20); // Truncate to 20 characters
  //   }
  //   // draw
  //   page.drawText(username, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
  //   render +=1;
  // };
  // if(passedarray[2]){
  //   // Truncate email if it's too long
  //   let email = user.email;
  //   if (email.length > 25) {
  //     email = email.substring(0, 25); // Truncate to 20 characters
  //   }
  //   //draw
  //   page.drawText(email, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
  //   render +=1;
  // };
  // if(passedarray[3]){
  //   page.drawText(user.role, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
  //   render +=1;
  // };
  // if(passedarray[4] && user.created_at != null){
  //   //convert to date
  //   const created = user.created_at.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  //   //draw
  //   page.drawText(created, { x: colpos[render] + 7, y: yPosition - rowHeight, font, size: 12 });
  //   render +=1;
  // };

  return yPosition - rowHeight; // Move the yPosition down after adding user data
};