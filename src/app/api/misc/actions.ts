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
    accessKeyId: process.env.AWS_ACCESS_KEYY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  requestHandler: {
    httpOptions: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,HEAD",
        "Access-Control-Allow-Headers": "*",
      },
    },
  },
});

// Add error handling for missing credentials
if (!process.env.AWS_ACCESS_KEYY || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    "AWS credentials are not properly configured. Please check your environment variables."
  );
}

if (!process.env.AWS_BUCKET) {
  throw new Error(
    "AWS bucket name is not configured. Please check your environment variables."
  );
}

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
  userId: number,
  genre: string = "Pop",
  duration: number = 180,
  albumName?: string,
  album_art?: string
) {
  try {
    if (!acceptedTypes.includes(type) || size > maxFileSize) {
      console.error("Invalid file type or size:", { type, size });
      return { failure: "Invalid file or file size!" };
    }

    const fileKey = generateFileName(type);
    console.log("Generating signed URL for file:", fileKey);

    const putObj = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: fileKey,
      ContentType: type,
      ContentLength: size,
      ChecksumSHA256: checksum,
    });

    const signedURL = await getSignedUrl(s3, putObj, { expiresIn: 5400 });
    console.log("Successfully generated signed URL");

    // Verify user exists before creating song
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      console.error("User not found:", userId);
      return { failure: "User not found" };
    }

    console.log("Creating song for user:", user);

    // Check if user has any followers
    const followers = await prisma.follows.findMany({
      where: { user_id_a: userId },
    });
    console.log("User followers:", followers);

    const song = await prisma.songs.create({
      data: {
        title: songName,
        genre: genre,
        duration: duration,
        file_path: fileKey,
        file_format: type.split("/")[1],
        user_id: userId,
        plays_count: 0,
      },
    });

    console.log("Successfully created song:", song);

    // Check if notifications were created
    const notifications = await prisma.notifications.findMany({
      where: {
        message: {
          contains: songName,
        },
      },
    });
    console.log("Created notifications:", notifications);

    //if album name is provided
    if (albumName && userId) {
      //find existing album with the same name
      const existingAlbum = await prisma.album.findFirst({
        where: {
          title: albumName,
          user_id: userId,
        },
      });

      let albumId: number;

      if (existingAlbum) {
        albumId = existingAlbum.album_id;
        if (album_art && existingAlbum.album_art !== album_art) {
          await prisma.album.update({
            where: { album_id: albumId },
            data: { album_art: album_art },
          });
        }
      } else {
        const newAlbum = await prisma.album.create({
          data: {
            title: albumName,
            user_id: userId,
            album_art: album_art || null, // set album image
          },
        });
        albumId = newAlbum.album_id;
      }

      //connect songs and albums using album_songs entity
      await prisma.album_songs.create({
        data: {
          album_id: albumId,
          song_id: song.song_id,
        },
      });

      //update album id for song
      await prisma.songs.update({
        where: { song_id: song.song_id },
        data: { album_id: albumId },
      });
    }

    return { success: { url: signedURL } };
  } catch (error) {
    console.error("Error in getSignedURL:", error);
    return {
      failure: `Failed to generate signed URL: ${
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
