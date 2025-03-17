"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSignedURL } from "@/app/api/misc/actions";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const selectedFile = input.files?.[0];

    setFile(selectedFile || null);

    if (fileURL) URL.revokeObjectURL(fileURL);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
    } else {
      setFileURL(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setStatusMessage("Uploading file...");
    setLoading(true);

    console.log("Uploading file:", file);
    if (!file) return;
    const urlresult = await getSignedURL();
    if (urlresult.failure !== undefined) {
      setStatusMessage("Failed to upload file!");
      setLoading(false);
      console.error("error");
      return;
    }

    const url = urlresult.success.url;

    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    setStatusMessage("File uploaded!");
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 bg-white p-6 rounded-lg shadow-md"
      >
        <Label htmlFor="audio">Audio File</Label>
        <Input
          id="audio"
          type="file"
          accept=".mp3,.ogg,.wav"
          onChange={handleFileChange}
        />
        {file && <p className="text-sm text-gray-500">{file.name}</p>}

        <Button type="submit" disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>

        {statusMessage && (
          <p className="text-sm text-gray-700">{statusMessage}</p>
        )}
      </form>
    </div>
  );
}
