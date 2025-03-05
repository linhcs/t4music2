"use client";
import { testupload } from "@/lib/s3";
export default function Home() {
  return (
    <div>
      Home
      <button onClick={testupload}>Test Upload</button>
    </div>
  );
}
