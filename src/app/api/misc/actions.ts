"use server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@prisma/script";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const acceptedTypes = ["audio/mpeg", "audio/ogg", "audio/wav"];
const maxFileSize = 1024 * 1024 * 10;

const generateFileName = (type: string) => {
  return `${Date.now()}.${type.split("/")[1]}`;
};

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  if (!acceptedTypes.includes(type) || size > maxFileSize) {
    return { failure: "Invalid file or file size!" };
  }

  const fileKey = generateFileName(type);

  const putObj = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: fileKey,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3, putObj, { expiresIn: 5400 });

  try {
    const song = await prisma.songs.create({
      data: {
        title: "Test Song",
        genre: "Pop",
        duration: 180,
        file_path: fileKey,
        file_format: type.split("/")[1],
        user_id: 1,
        plays_count: 0,
      },
    });
    

    if (!song) throw new Error("Database insert failed. No song was returned.");

    return { success: { url: signedURL, song } };
  } catch (error) {
    console.error("Database insert failed.", error);
    return { failure: "Failed to save song details in the database!" };
  }
}

export async function getPlaybackURL(fileKey: string) {
  try {
    const getObj = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: fileKey,
    });

    const signedURL = await getSignedUrl(s3, getObj, { expiresIn: 3600 }); // 1 hour expiry for playback

    return { success: { url: signedURL } };
  } catch (error) {
    console.error("Error generating playback URL:", error);
    return {
      failure: `Failed to generate playback URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
