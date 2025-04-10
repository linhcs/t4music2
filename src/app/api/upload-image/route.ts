import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"]; //check image type
    if (!acceptedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    );
    const containerClient = blobServiceClient.getContainerClient("images");
    await containerClient.createIfNotExists({ access: "blob" });

    const fileName = `${type}_${Date.now()}.${file.type.split('/')[1]}`;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
    await blockBlobClient.uploadData(Buffer.from(await file.arrayBuffer()), {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    const imageUrl = `https://musiclibraryfiles.blob.core.windows.net/images/${fileName}`;

    return NextResponse.json({ 
      success: true,
      url: imageUrl
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}