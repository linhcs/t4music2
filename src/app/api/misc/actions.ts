"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
    const title = "test";
    const duration = 123;
    const someUserId = 1;
    const albumId = 1;

    const query = `
    INSERT INTO songs (title, genre, duration, file_path, file_format, user_id, album_id)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
    const params = [
      title,
      "Pop",
      duration,
      signedURL,
      "mpeg",
      someUserId,
      albumId,
    ];

    await prisma.$queryRawUnsafe(query, ...params);

    const song = await prisma.songs.findFirst({
      where: { file_path: signedURL },
    });
    

    if (!song) throw new Error("Database insert failed. No song was returned.");

    return { success: { url: signedURL, song } };
  } catch (error) {
    console.error("Database insert failed.", error);
    return { failure: "Failed to save song details in the database!" };
  }
}
