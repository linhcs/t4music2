import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Missing file or userId" },
        { status: 400 }
      );
    }

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      return NextResponse.json(
        { error: "File too large. Max size is 5MB" },
        { status: 400 }
      );
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Supported types: JPG, PNG, WebP, GIF",
        },
        { status: 400 }
      );
    }

    // Check if Azure connection string is available
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      console.error("Azure storage connection string not configured");
      return NextResponse.json(
        {
          error: "Server configuration error",
        },
        { status: 500 }
      );
    }

    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING
      );
      const containerClient = blobServiceClient.getContainerClient("images");
      await containerClient.createIfNotExists({ access: "blob" });

      const fileName = `pfp_${userId}_${Date.now()}`;
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.uploadData(Buffer.from(await file.arrayBuffer()), {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      const pfpUrl = `https://musiclibraryfiles.blob.core.windows.net/images/${fileName}`;

      // Update user profile in database
      await prisma.users.update({
        where: { user_id: Number(userId) },
        data: { pfp: pfpUrl },
      });

      // Return updated user data
      const user = await prisma.users.findUnique({
        where: { user_id: Number(userId) },
        select: {
          username: true,
          email: true,
          role: true,
          pfp: true,
        },
      });

      return NextResponse.json({
        success: true,
        ...user,
      });
    } catch (blobError) {
      console.error("Azure blob storage error:", blobError);
      return NextResponse.json(
        {
          error: "Failed to upload image to storage",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error in uploadPfp:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
