import { NextResponse } from "next/server";
import { prisma } from "@prisma/script";


export async function POST(req: Request){
    try{
        const {userId, songId} = await req.json();

        await prisma.$executeRaw`
        INSERT INTO likes (listener_id, song_id,, liked_at)
        VALUES (${userId},${songId}, NOW())
        `;

        return NextResponse.json({ message : "Song liked!" });
    } catch (error) {
        if (error instanceof Error){
            console.error(error.message);
        } else {
            console.error("Error, could not like song!");
        }

    }
}
