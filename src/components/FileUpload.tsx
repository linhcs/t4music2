"use client";

import { useState, useRef } from "react";
import { getSignedURL } from "@/app/api/misc/actions";
import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
import { useUserStore } from "@/store/useUserStore";

export default function FileUpload() {
  const { user_id } = useUserStore();
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [songInfo, setSongInfo] = useState({
    title: '',
    genre: '',
    albumName: '',
    duration: 0,
    artistName: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSongInfo(prev => ({ ...prev, [name]: value }));
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      
      const handleLoadedMetadata = () => {
        URL.revokeObjectURL(objectUrl);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
        resolve(Math.round(audio.duration));
      };

      const handleError = (error: Event) => {
        console.error("❌ Error loading audio metadata:", error);
        URL.revokeObjectURL(objectUrl);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
        reject(new Error('Failed to load audio file'));
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);

      audio.src = objectUrl;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);

    if (fileURL) URL.revokeObjectURL(fileURL);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
      try {
        const durationInSeconds = await getAudioDuration(selectedFile);
        setSongInfo(prev => ({ ...prev, duration: durationInSeconds }));
      } catch (error) {
        console.error('Error getting audio duration:', error);
        setSongInfo(prev => ({ ...prev, duration: 0 }));
        setUploadStatus('❌ Error: Could not load audio file. Please try a different file.');
      }
    } else {
      setFileURL(null);
      setSongInfo(prev => ({ ...prev, duration: 0 }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setImageFile(selectedFile || null);

    if (imagePreview) URL.revokeObjectURL(imagePreview); //show artist preview of image before sending to db

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const computeSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const uploadImageToAzure = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "album-art");

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('❌ Please select a file');
      return;
    }

    console.log('Current user_id:', user_id);

    if (!user_id) {
      setUploadStatus('❌ User ID is required. Please log in again.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {

      let imageUrl: string | null = null;
      
      if (imageFile) {
        setUploadStatus('Uploading album art...'); //upload image then song
        imageUrl = await uploadImageToAzure(imageFile);
      }
      setUploadStatus('Preparing song upload...');
      const checksum = await computeSHA256(file);
      
      console.log('Creating song with user_id:', user_id);

      const urlresult = await getSignedURL(
        file.type,
        file.size,
        checksum,
        songInfo.title,
        user_id!,
        songInfo.genre,
        songInfo.duration,
        songInfo.albumName,
        imageUrl || undefined
      );

      if ("failure" in urlresult) {
        throw new Error(urlresult.failure);
      }
      setUploadStatus('Uploading song file...');
      const url = urlresult.success.url;
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage');
      }

      setUploadStatus('✅ File uploaded successfully!');
      setSongInfo({
        title: '',
        genre: '',
        albumName: '',
        duration: 0,
        artistName: ''
      });
      setFile(null);
      setImageFile(null);
      if (fileURL) URL.revokeObjectURL(fileURL);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setFileURL(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
    } catch (error) {
      setUploadStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar/>
      
      <div className="flex flex-col flex-1 min-w-0">
        <NavBar role="listener" />

        <main className="p-6 overflow-auto">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Upload New Song</h1>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Song Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={songInfo.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Album Name
                  </label>
                  <input
                    type="text"
                    name="albumName"
                    value={songInfo.albumName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Genre
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={songInfo.genre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-md text-white"
                    placeholder="Pop, Rock, Jazz, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Audio File* (.mp3, .ogg, .wav)
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".mp3,.ogg,.wav"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-500 file:text-white
                    hover:file:bg-purple-600 transition-colors"
                  required
                />
                {file && (
                  <div className="text-sm text-gray-400 mt-1">
                    <p>Selected: {file.name}</p>
                    {songInfo.duration > 0 && (
                      <p>Duration: {Math.floor(songInfo.duration / 60)}:
                      {(songInfo.duration % 60).toString().padStart(2, '0')}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Album Cover (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-500 file:text-white
                    hover:file:bg-blue-600 transition-colors"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Album cover preview" 
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploading || !file}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isUploading ? 'Uploading...' : 'Upload Song'}
              </button>

              {uploadStatus && (
                <div className={`p-3 rounded-md ${
                  uploadStatus.startsWith('✅') ? 'bg-green-900/50' : 
                  uploadStatus.startsWith('❌') ? 'bg-red-900/50' : 'bg-blue-900/50'
                }`}>
                  <p className="text-sm">{uploadStatus}</p>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}