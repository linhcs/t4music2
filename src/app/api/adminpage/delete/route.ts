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

  interface songs {
    song_id: number;
    title: string;
  }
  
  // Define a type that includes all possible structures for passedobj
  type PassedObj = listeners | artists | albums | songs;

  // Type guard to check if the object is an album
function isAlbum(obj: PassedObj): obj is albums {
  return (obj as albums).album_id !== undefined && (obj as albums).title !== undefined;
}

function isSong(obj: PassedObj): obj is songs {
  return (obj as songs).song_id !== undefined && (obj as songs).title !== undefined;
}

  export async function POST(req: Request) {
    try {

    const { selectedobj }: { selectedobj: PassedObj } = await req.json();; // This is where you get the passed object

    console.log('Parsed passedobj:', selectedobj);

    const isAlbumObject = isAlbum(selectedobj);
    const isSongObject = isSong(selectedobj);
    let tablename: string;
    let reference:string;
    let id:number;
    if(isAlbumObject){
      tablename = 'album';
      reference = 'album_id';
      id = selectedobj.album_id;
    } else if (isSongObject) {
      tablename = 'songs';
      reference = 'song_id';
      id = selectedobj.song_id;
    } else {
      tablename = 'users';
      reference = 'user_id';
      id = selectedobj.user_id;
    };

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