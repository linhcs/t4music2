"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaclient } from "../../../../prisma/script";

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
  const date = new Date();
  return `${date.getTime()}.${type.split("/")[1]}`;
};

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  console.log("AWS Credentials:", {
    AccessKey: process.env.AWS_ACCESS_KEY,
    SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  if (!acceptedTypes.includes(type)) {
    return { failure: "Invalid File Type!" };
  }

  if (size > maxFileSize) {
    return { failure: "File is too big!" };
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

  const title = "test";
  const duration = 123;
  const someUserId = 1;
  const albumId = 1;
  if (!title || !someUserId || !fileKey || !duration || !signedURL) {
    console.error("Missing required inputs for database insertion:", {
      title,
      someUserId,
      fileKey,
      duration,
      signedURL,
    });
    return { failure: "Required inputs are missing!" };
  }

  try {
    const query = `
      INSERT INTO songs (title, genre, duration, file_path, file_format, user_id, album_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *;
    `;

    const params = [
      title,
      "Pop",
      duration,
      fileKey,
      type.split("/")[1],
      someUserId,
      albumId,
    ];

    const song = await prismaclient.$queryRawUnsafe(query, ...params);

    if (!song) {
      console.error(
        "Database Insert Error: Insert returned null. Check your database or query."
      );
      console.error("Query:", query);
      console.error("Params:", params);
      throw new Error("Database insert failed. No song was returned.");
    }

    console.log("Database Insert Result:", song);
    return { success: { url: signedURL, song } };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Insert Error:", error.message);
      console.error("Stack Trace:", error.stack);
    } else {
      console.error("Database Insert Error:", error);
    }
    return { failure: "Failed to save song details in the database!" };
  }
}
