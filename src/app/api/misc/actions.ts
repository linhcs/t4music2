"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!, //there was a typo here causing song error
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const prisma = new PrismaClient();

const acceptedTypes = ["audio/mpeg", "audio/ogg", "audio/wav"];
const maxFileSize = 1024 * 1024 * 10;

const generateFileName = (type: string) => {
  return `${Date.now()}.${type.split("/")[1]}`;
};

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string,
  songName: string,
  artistName: string,
  genre: string = "Pop",
  duration: number = 180
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

  try {
    const signedURL = await getSignedUrl(s3, putObj, { expiresIn: 5400 });

    const song = await prisma.songs.create({
      data: {
        title: songName,
        genre: genre,
        duration: duration,
        file_path: fileKey,
        file_format: type.split("/")[1],
        user_id: 1,
        plays_count: 0,
      },
    });

    return { success: { url: signedURL, song } };
  } catch (error) {
    console.error("Database error:", error);
    return {
      failure: `Database operation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function getPlaybackURL(fileKey: string) {
  try {
    const getObj = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: fileKey,
    });

    const signedURL = await getSignedUrl(s3, getObj, { expiresIn: 3600 });

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
