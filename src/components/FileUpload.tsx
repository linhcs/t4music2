"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.FormEvent<HTMLFormElement>) => {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col items-center gap-2 bg-white p-6 rounded-lg shadow-md">
        <Label htmlFor="audio">Audio File</Label>
        <Input
          id="audio"
          type="file"
          accept=".mp3,.ogg,.wav"
          onChange={handleFileChange}
        />
        <button onClick={handleSubmit}></button>
      </div>
    </div>
  );
}
