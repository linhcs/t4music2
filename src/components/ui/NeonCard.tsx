"use client";
import { motion } from "framer-motion";

type NeonCardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function NeonCard({
  children,
  onClick,
  className = "",
}: NeonCardProps) {
  return (
    <motion.div
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`relative p-8 md:p-12 rounded-2xl cursor-pointer overflow-hidden ${className}`}
    >
      {/* Animated glowing background */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-purple-800 via-pink-700 to-red-600 blur-2xl"
      />
      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
      {/* Neon border overlay */}
      <motion.div
        whileHover={{ borderColor: "#ffffff" }}
        className="absolute inset-0 rounded-2xl border-2 border-transparent pointer-events-none transition-all duration-300"
      />
    </motion.div>
  );
}
