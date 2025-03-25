"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//import { metadata } from "../../layout";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
// do this later
const acceptedTypes = [
  "audio/mpeg", // mp3
  "audio/ogg",
  "audio/wav",
];
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
  console.log("Access Key:", process.env.AWS_ACCESS_KEY);
  console.log("Secret Key:", process.env.AWS_SECRET_ACCESS_KEY);

  const testfail = false;
  if (testfail) {
    return { failure: "Failed to upload file!" };
  }
  if (!acceptedTypes.includes(type)) {
    return { failure: "Invalid File Type!" };
  }

  if (size > maxFileSize) {
    return { failure: "File is too big!!" };
  }

  const putObj = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: generateFileName(type),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userID: "fortnite",
    },
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
      fileKey,
      "mpeg",
      someUserId,
      albumId,
    ];

    await prisma.$queryRawUnsafe(query, ...params);

    const song = await prisma.songs.findFirst({
      where: { file_path: fileKey },
    });

    if (!song) throw new Error("Database insert failed. No song was returned.");

    return { success: { url: signedURL, song } };
  } catch (error) {
    return { failure: "Failed to save song details in the database!" };
  }
}
