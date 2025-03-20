"use client";

import { motion } from "framer-motion";
import { FaHeadphones, FaMicrophone, FaMusic } from "react-icons/fa";
import Link from "next/link";

export default function SelectRolePage() {
  return (
    <main
      className="relative flex items-center justify-center min-h-screen bg-black"
      style={{
        background: `url("/futuristic-bg.jpg") center/cover no-repeat`,
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 p-4">
        {/* Listener Card */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group w-[300px] md:w-[350px] h-[480px] bg-gradient-to-b from-[#1f0030] via-[#2d0045] to-[#3a005a]
                     rounded-xl shadow-2xl p-6 relative overflow-hidden cursor-pointer"
        >
          <div className="flex flex-col items-center">
            {/* Speaker-like circle */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 shadow-inner flex items-center justify-center mb-6">
              <FaHeadphones size={40} className="text-pink-500 drop-shadow-md" />
            </div>
            {/* Card Title */}
            <h2 className="text-3xl font-bold text-white text-center tracking-wide mb-4">
              Listener
            </h2>
            {/* Subtitle / Tagline */}
            <p className="text-sm text-pink-100 text-center mb-8 px-4 leading-relaxed">
              Dive into endless tracks and discover new tunes every day.
            </p>
          </div>
          {/* Enhanced Link Button */}
          <Link href="/profile/user">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-full 
                         bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold 
                         tracking-wide shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
            >
              <span>I’m a Listener</span>
              <FaMusic className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Artist Card */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: -1 }}
          whileTap={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group w-[300px] md:w-[350px] h-[480px] bg-gradient-to-b from-[#250035] via-[#3d0050] to-[#54006a]
                     rounded-xl shadow-2xl p-6 relative overflow-hidden cursor-pointer"
        >
          <div className="flex flex-col items-center">
            {/* Speaker-like circle */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 shadow-inner flex items-center justify-center mb-6">
              <FaMicrophone size={40} className="text-purple-300 drop-shadow-md" />
            </div>
            {/* Card Title */}
            <h2 className="text-3xl font-bold text-white text-center tracking-wide mb-4">
              Artist
            </h2>
            {/* Subtitle / Tagline */}
            <p className="text-sm text-purple-100 text-center mb-8 px-4 leading-relaxed">
              Share your music, grow your fan base, and shine in the spotlight.
            </p>
          </div>
          {/* Enhanced Link Button */}
          <Link href="/profile/artist">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-full 
                         bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold 
                         tracking-wide shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <span>I’m an Artist</span>
              <FaMicrophone className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
