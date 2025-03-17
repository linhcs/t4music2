"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from './module/PrivacyPolicy.module.css';
import React from 'react';

export default function Privacy() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
            className="text-white/60 mt-10 tracking-[0.2em] text-sm"
          >
            <em>Because Your Data Should Be as Safe as Your Favorite Playlist ~ me</em>
          </motion.p>
        <motion.p
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x:-140 }}
            transition={{ duration: 1.25, delay: 2 }}
            className="text-white/60 mt-2 tracking-[0.2em] text-sm"
          >
            Last Updated: {formattedDate} ... 👀
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
            Welcome to <strong>Amplifi</strong>—your go-to music-sharing platform where the beats flow freely, the tracks never end, and most importantly, <strong>your data stays safe</strong>. This app is totally free (because, hey, it&apos;s a school project!), and we&apos;re here to provide you with an awesome music experience without any hidden agendas. Seriously, we&apos;re just here for the music.
          </p>
          <p>
            Before you dive into your favorite jams, let us quickly walk you through what happens with your data. And just so you know—this is <strong>not</strong> a money-laundering operation. We&apos;re fully above board...<em>like, super above board</em>.
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

          <h2 id="Data" className="text-2xl font-semibold mt-10 mb-4">The Data We Collect (Yes, We&apos;re Nosy... In a Cool Way)</h2>
          <p>
            Okay, we admit it—we&apos;re a little nosy. But only because we want to give you the best music experience ever. Here&apos;s what we collect:
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}><strong>Personal Information:</strong> Your name, email, and maybe even your favorite genres.</li>
            <li className={styles.li2}><strong>Usage Data:</strong> How often you listen to that one song on repeat (don&apos;t worry, we get it).</li>
            <li className={styles.li2}><strong>Device Information:</strong> To make sure you can listen anywhere—phone, tablet, laptop, or all of the above.</li>
          </ul>
          <p>
            <strong>No funny business here</strong>. We&apos;re just trying to help you find great music, not siphon off your life savings to some offshore account. Pinky promise.
          </p>
          <h2 id="Why" className="text-2xl font-semibold mt-10 mb-4">Why We Collect Your Data (We&apos;re Not That Creepy)</h2>
          <p>
            So why do we need your info? Well, here&apos;s the deal:
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}><strong>To Improve Your Experience:</strong> We use your activity and preferences to suggest tracks you might actually love (no, we&apos;re not mind-readers, but we&apos;re close).</li>
            <li className={styles.li2}><strong>To Communicate:</strong> We want to keep you in the loop with updates, bug fixes, and new features. Plus, a little music news here and there, right?</li>
            <li className={styles.li2}><strong>To Keep Things Running Smoothly:</strong> Knowing which devices you use and how often helps us make Amplifi faster and more reliable.</li>
          </ul>
          <p>
            We promise, there&apos;s no <em>&quot;spying for profit&quot;</em> happening here. We collect only what we need to improve your experience.
          </p>
          <h2 id="How" className="text-2xl font-semibold mt-10 mb-4">How We Use Your Data (And How We Don&apos;t Use It)</h2>
          <p>
            We&apos;ll never sell or trade your personal data for anything—nope, not even for the best playlist in the world. Here&apos;s how we use it:
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}><strong>To Personalize Your Experience:</strong> If we know what kind of music you like, we can send you some good recommendations (you might thank us later).</li>
            <li className={styles.li2}><strong>To Keep You Connected:</strong> We use your email to tell you when new features roll out or there&apos;s something cool happening on Amplifi.</li>
            <li className={styles.li2}><strong>For Service Improvements:</strong></li>
          </ul>
          <p>
          We <em>don&apos;t</em> sell your data. Period. We <em>don&apos;t</em> share your data with shady third parties. Ever. Pinky Promise. Fr Fr.
          </p>
          <h2 id="Protek" className="text-2xl font-semibold mt-10 mb-4">Data Protection (Your Info is Safe with Us)</h2>
          <p>
            Your data is more precious than a rare vinyl. That&apos;s why we treat it like gold. Here&apos;s what we do to keep your info safe:
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}><strong>Encryption: </strong>All data you send to us is encrypted (or at least your password is...).</li>
            <li className={styles.li2}><strong>Secure Servers: </strong>We store your data on secure servers that are protected by industry-standard security measures (we paid at least 3 dollars to the lowest biddder for them).</li>
            <li className={styles.li2}><strong>Limited Access: </strong>Only a <em>few</em> of our trusted team members have access to your data, and they&apos;re not using it for anything creepy (promise!).</li>
          </ul>
          <p>
            We take your privacy seriously, and we do everything we can to protect your data.
          </p>
          
          <h2 id="Cookies" className="text-2xl font-semibold mt-10 mb-4">Cookies (Not the Sweet, Chocolate Chip Kind)</h2>
          <p>
            No, we don&apos;t track you with delicious treats. But we do use something called cookies to make sure Amplifi works well for you.
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}><strong>What They Do: </strong>Cookies are little bits of data that help us remember things like your preferences, log-in info, and browsing history. They help us speed things up and personalize your experience.</li>
            <li className={styles.li2}><strong>What We Don&apos;t Do: </strong>Cookies won&apos;t track your every move on the internet or show you creepy ads. We use them responsibly.</li>
          </ul>
          <p>
            You can disable cookies if you prefer, but just know that some features of Amplifi might not work as well without them.
          </p>
          <h2 id="Rights" className="text-2xl font-semibold mt-10 mb-4">Your Rights (Because You&apos;re a Legal Genius Now)</h2>
          <p>
            You&apos;re in charge of your data. Here&apos;s what you can do:
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}><strong>Access: </strong>You can always see what data we have about you.</li>
            <li className={styles.li2}><strong>Update: </strong>You can correct any info that&apos;s wrong (we don&apos;t want any mix-ups!).</li>
            <li className={styles.li2}><strong>Delete: </strong>You can request to have your data deleted whenever you want. If you decide Amplifi isn&apos;t your jam anymore, we&apos;ll respect that.</li>
            <li className={styles.li2}><strong>Opt-Out: </strong>If you don&apos;t want us to send you updates or recommendations, you can opt-out of marketing communications at any time. (But we&apos;ll miss you!)</li>
          </ul>
          <p>
            We respect your rights and want to make sure you&apos;re in control of your data.
          </p>
          <h2 id="Retention" className="text-2xl font-semibold mt-10 mb-4">Data Retention (We Don&apos;t Hoard Your Data Like a Crazy Ex)</h2>
          <p>
          Unlike that one person who holds onto everything, we don&apos;t hoard your data. We only keep your info as long as we need it to:
          </p>
          <ul className={styles.ul2}>
            <li className={styles.li2}>Provide you with our services (like sharing your music).</li>
            <li className={styles.li2}>Comply with legal obligations (we&apos;re <em>definitely</em> law-abiding citizens, after all).</li>
            <li className={styles.li2}>Resolve disputes and enforce our terms (just in case someone tries to get tricky).</li>
          </ul>
          <p>
          Once we no longer need your data, we&apos;ll either delete it or anonymize it (so you&apos;re not secretly identified in some <em>shadowy</em> digital ledger).
          </p>
          <h2 id="Changes" className="text-2xl font-semibold mt-10 mb-4">Changes to This Policy (Because Life Changes and So Do We)</h2>
          <p>
            Life happens, and sometimes policies need to change. If we update this privacy policy, we&apos;ll let you know with a quick notice on the app or via email. We&apos;ll also update the <em>&quot;last revised&quot;</em> date, so you know when we made changes.
          </p>
          <p>
            But don&apos;t worry, if you&apos;re still on Amplifi, we&apos;re not running any underground operations—we&apos;ll always be open and transparent with how we handle your info (no backdoor deals with shady entities).
          </p>
          <p>
          Thank you for trusting Amplifi with your music and data. We promise to keep everything cool, safe, and free of weird, <em>shady</em> business (and definitely no money-laundering schemes). Now, let&apos;s get back to the music! 🎶
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
