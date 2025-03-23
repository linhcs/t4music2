import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(){
    try {
        const songs = await prisma.songs.findMany({
            include: {
                album: true,
            },
        });
        return NextResponse.json(songs, { status: 200});
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }

        return NextResponse.json(
            { error: "Failed to fetch songs"},
            { status: 500}
        );
    }
}