"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedURL() {
  const testfail = false;
  if (testfail) {
    return { failure: "Failed to upload file!" };
  }
  console.log("BREAKPOINT # 1");
  const putObj = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: "test-file",
  });
  console.log("BREAKPOINT # 2");

  const signedURL = await getSignedUrl(s3, putObj, { expiresIn: 5400 });
  console.log("BREAKPOINT # 3");

  return { success: { url: signedURL } };
}
