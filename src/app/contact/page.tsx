"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/*Header Section */}
      <header className="flex-3 flex flex-col items-center justify-center pt-16 p-1">
        <motion.h1
            initial={{ opacity: 1, y: 240 }}
            animate={{ opacity: 0, y: -500 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="text-[8rem] md:text-[8rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient"
            >
            How to Contact Us
        </motion.h1>
      </header>
      <header className="flex-3 flex flex-col items-center justify-center pt-16 p-1">
        <motion.h1
            initial={{ opacity: 0, y: -500 }}
            animate={{ opacity: 1, y: -200 }}
            transition={{ duration: 1.5, delay: 2.75 }}
            className="text-[4rem] md:text-[4rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient"
            >
            Please Don&apos;t
        </motion.h1>
      </header>

      
      <main className="flex-1 px-80 mt-[-160px] text-white">
        <div className="prose mx-auto text-left">
          {/* Body */}
          <motion.div
            initial={{ opacity: 0, x:-500}}
            animate={{ opacity: 1, x:0}}
            transition={{ duration: 2, delay: 3.5 }}
            className="text-white/80 tracking-tight text-med"
          >

          {/* Corrected usage of headings and paragraphs */}
          <h2 className="text-2xl font-semibold mb-4">Yes I&apos;m Serious </h2>
          <p className ="text-lg">
            But if you must, it needs to be accompanied by some <strong><em>Financial Assistance</em></strong> if you catch my drift ...
          </p>
          <div className="flex gap-20 px-40 mt-8 justify-center">
            <img
              src="artist-banner.jpg"
              alt="Artist Banner"
              className=" w-80 h-80 rounded-3xl"
            />
            <img
              src="artist-banner.jpg"
              alt="Artist Banner"
              className=" w-80 h-80 rounded-3xl"
            />
          </div>
          
          </motion.div>

          <footer>
          {/*Return*/}
          <motion.div
            initial={{ opacity: 0, scale: .8}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 3 }}
            className="flex justify-end pt-8 mt-6"
          >
            {/* Return */}
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-4 text-[17px] text-white border border-white/10 transition-all duration-300 hover:scale-90 
                bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"
                >
                Return
              </Button>
            </Link>
          </motion.div>
          </footer>
        </div>
      </main>
    </div>
  );
}
