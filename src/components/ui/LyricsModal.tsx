"use client";

import { Song } from "@/types";
import { IoMdClose } from "react-icons/io";
import { FiLoader } from "react-icons/fi";

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  lyrics: string | null;
  isLoading: boolean;
}

const LyricsModal = ({
  isOpen,
  onClose,
  song,
  lyrics,
  isLoading,
}: LyricsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-lg bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">
            {song ? `Lyrics: ${song.title}` : "Lyrics"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <FiLoader className="animate-spin text-purple-500 text-2xl" />
            </div>
          ) : lyrics ? (
            <div className="whitespace-pre-line text-gray-200">{lyrics}</div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              Lyrics Not available for this song
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LyricsModal;
