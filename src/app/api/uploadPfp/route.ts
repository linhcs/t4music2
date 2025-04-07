import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData(); //get file and user_id
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) { //reject if no file or not logged in
      return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString( //send to azure blob
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    );
    const containerClient = blobServiceClient.getContainerClient("images");
    await containerClient.createIfNotExists({ access: "blob" });

    const fileName = `pfp_${userId}_${Date.now()}`;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(Buffer.from(await file.arrayBuffer()), {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    const pfpUrl = `https://musiclibraryfiles.blob.core.windows.net/images/${fileName}`;

    await prisma.users.update({ //save url as pfp 
      where: { user_id: Number(userId) },
      data: { pfp: pfpUrl },
    });

    const user = await prisma.users.findUnique({
      where: { user_id: Number(userId) },
      select: {
        username: true,
        email: true,
        role: true,
        pfp: true
      }
    });

    return NextResponse.json({
      ...user,
      success: true
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}