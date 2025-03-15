"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -500 }}
            animate={{ opacity: 1, y: 100 }}
            transition={{ duration: 1.25 }}
            className="text-[4rem] md:text-[4rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient"
            >
            Terms & Conditions
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, xx: 100}}
            transition={{ duration: 1.25, delay: 1 }}
            className="text-white/60 tracking-[0.3em] uppercase text-sm"
          >
            

          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 1000}}
            animate={{ opacity: 1, scale: 1, x: 800 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            {/* Log In Button 
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full px-3 text-white border border-white/10 min-w-[10px] transition-all duration-300 hover:scale-50 
                bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"
>
                ∧
              </Button>
            </Link>
            */}
          
          </motion.div>
        </div>
      </main>
    </div>
  );
}
