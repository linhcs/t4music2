import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "mp3";

export async function uploadToAzureBlobFromServer(fileBuffer: Buffer, fileName: string): Promise<string> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING!);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  await containerClient.createIfNotExists({ access: "blob" });

  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadData(fileBuffer);
  
  return `https://musiclibraryfiles.blob.core.windows.net/${CONTAINER_NAME}/${fileName}`;
}