"use client";

import { useState } from "react";
import { getSignedURL } from "@/app/api/misc/actions";
import NavBar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/Sidebar";
//import { useUserStore } from "@/store/useUserStore";

export default function FileUpload() {
  //const { username } = useUserStore();
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [songInfo, setSongInfo] = useState({
    title: '',
    genre: '',
    albumName: '',
    artistName: '', // username || ''
    duration: 0
  });

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

  const computeSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('❌ Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {
      const checksum = await computeSHA256(file);
      const urlresult = await getSignedURL(
        file.type,
        file.size,
        checksum,
        songInfo.title,
        songInfo.artistName,
        songInfo.genre,
        songInfo.duration
      );

      if ("failure" in urlresult) {
        throw new Error(urlresult.failure);
      }

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
        artistName: '', // username || ''
        duration: 0
      });
      setFile(null);
      if (fileURL) URL.revokeObjectURL(fileURL);
      setFileURL(null);
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Artist Name*
                  </label>
                  <input
                    type="text"
                    name="artistName"
                    value={songInfo.artistName}
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