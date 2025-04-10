"use client";

import { FaPlusCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function ChangeProfilePic ({ currentPfp, userId, onUploadComplete = () => {} }: { 
    currentPfp: string;
    userId: number;
    onUploadComplete?: (url: string) => void;}) {
    //user clicks on (+) -> prompts for image upload -> stores image in azure blob -> sends image url to database
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState(currentPfp);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
      setPreviewUrl(currentPfp);
    }, [currentPfp]);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        try {
          setPreviewUrl(URL.createObjectURL(file)); //preview

          const formData = new FormData();
          formData.append("file", file);
          formData.append("userId", userId.toString());

          const response = await fetch("/api/uploadPfp", { //send data to api
            method: "POST",
            body: formData,
          });
    
          if (!response.ok) throw new Error("Upload failed");
    
          const { url } = await response.json(); //get image url and update zustand
          onUploadComplete(url);
          window.location.reload();
        } catch (error) {
          console.error("Upload error:", error);
          setPreviewUrl(currentPfp);
        } finally {
          setIsUploading(false);
        }
      };
    
      return (
        <div className="relative w-40 h-40">
          {/*profile picture*/}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 p-1 shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={previewUrl || "/default_pfp.jpg"}
                alt="Profile"
                width={160}
                height={160}
                className="object-cover w-full h-full rounded-full"
                key={previewUrl}
              />
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaPlusCircle className="text-blue-500 text-xl" />
          </button>
    
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
    
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <span className="text-white text-sm">Processing...</span>
            </div>
          )}
        </div>
      );
    }