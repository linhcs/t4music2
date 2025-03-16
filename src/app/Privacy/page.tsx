"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from './module/PrivacyPolicy.module.css';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/*Header Section */}
      <header className="flex-3 flex flex-col items-center justify-center pt-16 p-1">
        <motion.h1
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x:0 }}
            transition={{ duration: 1.25 }}
            className="text-[4rem] md:text-[4rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient"
            >
            Privacy Policy
        </motion.h1>

        <motion.p
            initial={{ opacity: 0, x: 500 }}
            animate={{ opacity: 1, x:0 }}
            transition={{ duration: 1.25, delay: 1 }}
            className="text-white/60 mt-10 tracking-[0.3em] text-sm"
          >
            <em>Because Your Data Should Be as Safe as Your Favorite Playlist ~ me</em>
          </motion.p>
        <motion.p
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x:-220 }}
            transition={{ duration: 1.25, delay: 2 }}
            className="text-white/60 mt-2 tracking-[0.3em] text-sm"
          >
            Last Updated: 3/5/2025 
          </motion.p>
      </header>

      
      <main className="flex-1 px-80 py-20 text-white">
        <div className="prose mx-auto text-left">
          {/* Body */}
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 1.25, delay: 1 }}
            className="text-white/80 tracking-tight text-med"
          >

          {/* Corrected usage of headings and paragraphs */}
          <p>
            Welcome to <strong>Amplifi</strong>—your go-to music-sharing platform where the beats flow freely, the tracks never end, and most importantly, <strong>your data stays safe</strong>. This app is totally free (because, hey, it's a school project!), and we're here to provide you with an awesome music experience without any hidden agendas. Seriously, we’re just here for the music.
          </p>
          <p>
            Before you dive into your favorite jams, let us quickly walk you through what happens with your data. And just so you know—this is <strong>not</strong> a money-laundering operation. We're fully above board...<em>like, super above board</em>.
          </p>
          <h3 className="text-2xl font-semibold mt-10">TABLE OF CONTENTS</h3>
          <div className="table-of-contents text-xl font-semibold mt-2 ">
            <ul>
            <li><a href="#Data">A. The Data We Collect</a></li>
            <li><a href="#Why">B. Why We Collect Your Data</a></li>
            <li><a href="#How">C. How We Use Your Data</a></li>
            <li><a href="#Protek">D. Data Protection</a></li>
            <li><a href="#Cookies">E. Cookies</a></li>
            <li><a href="#Rights">F. Your Rights</a></li>
            <li><a href="#Retention">G. Data Retention</a></li>
            <li><a href="#Changes">H. Changes to This Policy</a></li>
            </ul>
          </div>

          <h2 id="Data" className="text-2xl font-semibold mt-10 mb-4">The Data We Collect (Yes, We’re Nosy... In a Cool Way)</h2>
          <p>
            Okay, we admit it—we’re a little nosy. But only because we want to give you the best music experience ever. Here’s what we collect:
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}><strong>Personal Information:</strong> Your name, email, and maybe even your favorite genres.</li>
            <li className={styles.li2}><strong>Usage Data:</strong> How often you listen to that one song on repeat (don’t worry, we get it).</li>
            <li className={styles.li2}><strong>Device Information:</strong> To make sure you can listen anywhere—phone, tablet, laptop, or all of the above.</li>
          </ul>
          <p>
            <strong>No funny business here</strong>. We’re just trying to help you find great music, not siphon off your life savings to some offshore account. Pinky promise.
          </p>
          <h2 id="Why" className="text-2xl font-semibold mt-10 mb-4">Why We Collect Your Data (We’re Not That Creepy)</h2>
          <p>

          </p>
          <h2 id="How" className="text-2xl font-semibold mt-10 mb-4">How We Use Your Data (And How We Don’t Use It)</h2>
          <p>
            
          </p>
          <h2 id="Protek" className="text-2xl font-semibold mt-10 mb-4">Data Protection (Your Info is Safe with Us)</h2>
          <p>
            
          </p>
          <h2 id="Cookies" className="text-2xl font-semibold mt-10 mb-4">Cookies (Not the Sweet, Chocolate Chip Kind)</h2>
          <p>
            
          </p>
          <h2 id="Rights" className="text-2xl font-semibold mt-10 mb-4">Your Rights (Because You’re a Legal Genius Now)</h2>
          <p>
            
          </p>
          <h2 id="Retention" className="text-2xl font-semibold mt-10 mb-4">Data Retention (We Don’t Hoard Your Data Like a Crazy Ex)</h2>
          <p>
            
          </p>
          <h2 id="Changes" className="text-2xl font-semibold mt-10 mb-4">Changes to This Policy (Because Life Changes and So Do We)</h2>
          <p>
            
          </p>
          </motion.div>

          <footer>
          {/*Return*/}
          <motion.div
            initial={{ opacity: 0, scale: .8}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex justify-end pt-8"
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
