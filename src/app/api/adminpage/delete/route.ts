import { NextResponse } from 'next/server'
import { prisma } from "../../../../../prisma/script";

interface listeners {
    user_id: number;
    username: string;
  }
  
  interface artists {
    user_id: number;
    username: string;
  }
  
  interface albums {
    user_id: number;
    album_id: number;
    title: string;
  }
  
  // Define a type that includes all possible structures for passedobj
  type PassedObj = listeners | artists | albums;

  export async function POST(req: Request) {
    try {

    const { selectedobj }: { selectedobj: PassedObj } = await req.json();; // This is where you get the passed object

    console.log('Parsed passedobj:', selectedobj);

    const check = selectedobj.hasOwnProperty('username') ? 0 : 1;
    
    const tablename = check == 0 ? 'users' : 'album';
    const reference = check == 0 ? 'user_id' : 'album_id';
    const id = check == 0 ? selectedobj.user_id : selectedobj.album_id;
    const rawquery = `DELETE FROM ${tablename} WHERE ${reference} = ${id};`;

    
    // Query the database for some data
    const result = await prisma.$queryRawUnsafe(rawquery);

    // Log how many rows were affected (result might be 0 if no rows were deleted)
    console.log('Rows affected:', result);
  
    return new NextResponse(null, { status: 200 });

  } catch (error: unknown) {
    console.error("Error:", error);
    // Return a 500 status code if there's an error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}