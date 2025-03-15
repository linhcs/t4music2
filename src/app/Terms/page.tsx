"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/*Header Section */}
      <header className="flex-3 flex flex-col items-center justify-center pt-16 p-1">
        <motion.h1
            initial={{ opacity: 0, y: -500 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25 }}
            className="text-[4rem] md:text-[4rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-500 animate-gradient"
            >
            Terms & Conditions
        </motion.h1>
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
          <h2 className="text-2xl font-semibold mb-0">DISCLAIMER: </h2>
          <p>
          This document is obviously not legally binding... unless you're grading this assignment, in which case, we hereby request that you award the Amplifi team an "A." Yes, we’re serious. But please note: we are not responsible for any future grades or academic performance implications (unless you are grading this assignment). By continuing, you acknowledge that this entire document is written in jest but should be treated with the utmost seriousness in a classroom context, as long as the grading is favorable.
          </p>
          <h3 className="text-2xl font-semibold mt-10">TABLE OF CONTENTS</h3>
          <div className="table-of-contents text-xl font-semibold mt-2 ">
            <ul>
            <li className="mb-1"><a href="#Introduction">A. Introduction</a></li>
            <li className="mb-1"><a href="#Payments">B. Payments, Taxes, And Refunds</a></li>
            <li className="mb-1"><a href="#Account">C. Account</a></li>
            <li className="mb-1"><a href="#Privacy">D. Privacy</a></li>
            <li className="mb-1"><a href="#Accessibility">E. Accessibility</a></li>
            <li className="mb-1"><a href="#Services">F. Services And Content Usage Rules</a></li>
            <li className="mb-1"><a href="#Termination">G. Termination And Suspension Of Services</a></li>
            <li className="mb-1"><a href="#Downloads">H. Downloads</a></li>
            <li className="mb-1"><a href="#Content">I. Content And Service Availability</a></li>
            <li className="mb-1"><a href="#Third">J. Third-Party Devices And Equipment</a></li>
            <li className="mb-1"><a href="#Submissions">K. Your Submissions To Our Services</a></li>
            <li className="mb-1"><a href="#Family">L. Family Sharing</a></li>
            <li className="mb-1"><a href="#Additional">M. Additional App Store Terms</a></li>
            <li className="mb-1"><a href="#Amplifi">N. Additional Amplifi Music Terms</a></li>
            <li className="mb-1"><a href="#Carrier">O. Carrier Membership</a></li>
            <li className="mb-1"><a href="#Misc">P. Misc. Terms Applicable To All Services</a></li>
            <li className="mb-1"><a href="#Indemnification">Q. Indemnification And Liability</a></li>
            <li className="mb-1"><a href="#Grade">R. Grade Improvement Clause</a></li>
            <li className="mb-1"><a href="#Social">S. Forced Social Interactions And Team Bonding</a></li>
            <li className="mb-1"><a href="#Closing">T. Closing Statement And Acknowledgement</a></li>
            </ul>
          </div>

          <h2 id="Introduction" className="text-2xl font-semibold mt-10 mb-4">Introduction</h2>
          <p>
            Welcome to our Terms and Conditions page! By accessing or using any of the services related to our group project, you hereby agree to all of these terms. These are not legally binding... unless you’re the one grading this assignment, in which case, we humbly request a solid "A" for the Amplifi team. In the event that this request is ignored, we reserve the right to dramatically protest by submitting a much more creative project next time. This is our promise to you. Please note that by reading these terms, you acknowledge the likelihood that none of this will hold up in a court of law, but it’s still fun to pretend.
          </p>
          <h2 id="Payments" className="text-2xl font-semibold mt-10 mb-4">Payments, Taxes, And Refunds</h2>
          <p>
            There are no payments associated with the services provided under this project, nor are there any taxes to be paid. Should you choose to pay us for any reason, please note that we will not accept payment in the form of digital currency, checks, or any form of gratitude. Refunds are equally unavailable. If you feel you deserve a refund for anything related to this project, we recommend seeking support from your professor. If you do get a refund, please consider sharing the secret with the rest of us. We’ll be waiting.
          </p>
          <h2 id="Account" className="text-2xl font-semibold mt-10 mb-4">Account</h2>
          <p>
            To enjoy all the features of our app, you might need to create an account. Please choose a username that reflects your love for music—no “BingeListener999” unless that’s truly your vibe. When registering, you’ll provide us with information that we’ll try our best to keep safe (but let’s be honest, we might forget it at some point). Your account is personal and non-transferable, so don’t even think about selling it or trading it for VIP access. If you forget your password, just embrace the mystery of your forgotten identity and move on with the music.
          </p>
          <h2 id="Privacy" className="text-2xl font-semibold mt-10 mb-4">Privacy</h2>
          <p>
            We care about your privacy. In fact, we care so much that we will try our hardest not to share your information with anyone. However, if your information somehow gets leaked, we will use that as material for a group chat roast and then promptly forget about it. Any personal data that you share with us will be treated with the utmost disregard—err, we mean care. Just don’t go posting your social security number in the chat, and we’ll be good. Privacy is only important when it’s convenient.
          </p>
          <h2 id="Accessibility" className="text-2xl font-semibold mt-10 mb-4">Accessibility</h2>
          <p>
            We’ve worked hard to ensure that our services are accessible to all users, including those who still use Internet Explorer. Unfortunately, that’s where our accessibility features end. If you experience any issues with accessibility, please send us a polite message and we will attempt to respond—eventually. Our main goal is to make sure that everything works smoothly for everyone, as long as everyone includes us. If it doesn’t work, consider it a challenge for the future.
          </p>
          <h2 id="Services" className="text-2xl font-semibold mt-10 mb-4">Services And Content Usage Rules</h2>
          <p>
            All content made available by our project, whether it’s code, ideas, designs, or memes, is strictly for educational use and must not be repurposed for commercial gain (unless, of course, you want to pay us royalties for ideas you steal from us—just kidding, don’t do that). You agree not to engage in any activity that will result in the illegal or unethical distribution of our content, including but not limited to selling it, copying it, or uploading it to shady websites. If you decide to steal our content, at least give us credit, preferably in your Instagram bio.
          </p>
          <h2 id="Termination" className="text-2xl font-semibold mt-10 mb-4">Termination And Suspension Of Services</h2>
          <p>
            If at any point we feel that your use of the app is violating our guidelines (or we’re just feeling a bit dramatic), we reserve the right to suspend your access. While suspended, you’ll still be able to enjoy all the public content and features, but you won’t be able to interact in the community or access certain exclusive areas. If you think we’ve made a mistake, you can appeal by sending us a heartfelt playlist of your best tracks explaining why you should be reinstated. Your appeal will be reviewed by the team and voted on. If the vote is unanimous, you’re back in—just make sure to keep the vibes positive this time!
          </p>
          <h2 id="Downloads" className="text-2xl font-semibold mt-10 mb-4">Downloads</h2>
          <p>
            Our app may offer downloadable content, including music tracks, playlists, and maybe even a quirky behind-the-scenes video of us trying to look cool. You’re free to download anything available, but just a heads-up—downloading won’t unlock any hidden features or extra perks. If you use these downloads for anything outside the app's intended purpose, don’t worry... we’re probably not keeping tabs on you, but hey, we’re still watching out for the good vibes!
          </p>
          <h2 id="Content" className="text-2xl font-semibold mt-10 mb-4">Content And Service Availability</h2>
          <p>
            We strive to keep everything running smoothly and all content available 100% of the time. However, if our servers decide to crash (because one of us procrastinated too long), we’ll let you know. Don’t panic. Service interruptions are to be expected, especially when deadlines loom. Any downtime will be followed by an apology message that may or may not be sincere, depending on the mood of the group.
          </p>
          <h2 id="Third" className="text-2xl font-semibold mt-10 mb-4">Third-Party Devices And Equipment</h2>
          <p>
            Our project is designed to work on most devices, though we make no promises about compatibility with antique electronics or anything produced before the 2010s. Please ensure your device is capable of handling basic internet usage. If you attempt to run our project on a flip phone, you might experience difficulties, and we will not be responsible for any resulting frustration.
          </p>
          <h2 id="Submissions" className="text-2xl font-semibold mt-10 mb-4">Your Submissions To Our Services</h2>
          <p>
            By submitting any tracks, playlists, or creative ideas to our app, you agree to let us use your genius work however we see fit, including passing it off as the next big hit. You also agree that your contributions may be forever immortalized in the app—whether that’s a playlist you made or a song you shared, it’ll live on (even if it’s a little cringey in hindsight). But don’t worry—our app’s history may get a refresh or a playlist purge by the time we roll out the next big update.
          </p>
          <h2 id="Family" className="text-2xl font-semibold mt-10 mb-4">Family Sharing</h2>
          <p>
            No.
          </p>
          <h2 id="Additional" className="text-2xl font-semibold mt-10 mb-4">Additional App Store Terms</h2>
          <p>
            If you happen to download our project-related app (which is highly unlikely), please note that the terms and conditions of the respective app store apply. You may be required to sign in with your Apple ID, Google Play account, or a similar platform, and agree to terms that are far more official than this one.
          </p>
          <h2 id="Amplifi" className="text-2xl font-semibold mt-10 mb-4">Additional Amplifi Music Terms</h2>
          <p>
            Should we ever decide to write music for this project (and let’s be real, we probably won’t), you are free to use it in your own creative works, provided that you include an enthusiastic shout-out to Amplifi on your social media. If you remix any of our music and it goes viral, we’ll pretend we knew you when.
          </p>
          <h2 id="Carrier" className="text-2xl font-semibold mt-10 mb-4">Carrier Membership</h2>
          <p>
            This project does not include any carrier memberships. Sorry, no exclusive VIP access, unless you’re somehow in our group chat, in which case you’ve already earned the true privilege.
          </p>
          <h2 id="Misc" className="text-2xl font-semibold mt-10 mb-4">Miscellaneous Terms Applicable To All Services</h2>
          <p>
            We reserve the right to change anything at any time, including but not limited to our opinions, ideas, and deadlines. If we make any changes, we’ll probably forget to tell you. Just keep checking back to see if anything’s different.
          </p>
          <h2 id="Indemnification" className="text-2xl font-semibold mt-10 mb-4">Indemnification And Liability</h2>
          <p>
            If anything goes wrong as a result of using our app—whether it’s a song you didn’t mean to share or an unexpected playlist mishap—we’re not responsible. You agree to hold us harmless from any complaints, lawsuits, or annoyed messages from your friends or professors. But if you discover the next big hit and go viral, we’ll gladly take all the credit. It’s a win-win!
          </p>
          <h2 id="Grade" className="text-2xl font-semibold mt-10 mb-4">Grade Improvement Clause</h2>
          <p>
            If you happen to be the one responsible for grading this app (whether it’s a professor or some mystical being with the power to determine our fate), we kindly request that you award us a 101% A. Yes, you read that correctly—101%. Because, let's face it, we’ve crafted a musical listening experience so great that it deserves to break the grading scale. If for some bizarre reason you decide that an A isn’t in order, we, as a group of loyal listeners, expect you to accept the responsibility of a small, tasteful (and mostly peaceful) riot led by every student who’s ever used our app. Don’t worry, it will involve minimal chanting, a lot of good tunes, and perhaps a few posters with catchy phrases like "We Deserve the A!" and "Make It a Hit!" Ultimately, though, it’s all about ensuring that the grade matches the pure musical magic we’ve created here. So please, grant us our deserved A—before the riot tunes go live.
          </p>
          <h2 id="Social" className="text-2xl font-semibold mt-10 mb-4">Forced Social Interactions And Team Bonding</h2>
          <p>
            By agreeing to these terms, you acknowledge that at some point, you’ll be required to participate in at least one group chat “bonding” exercise. These may include sharing memes that are slightly out of context, passive-aggressive comments about who skipped on playlist curation, or pretending to enjoy group activities like “Rate Your Top 5 Tracks” discussions. These exercises are mandatory, and we promise there will be a long, spirited debate about who didn’t pull their weight—because let’s be real, someone always forgets to update the playlist. But hey, it’s all in the name of bonding… and maybe discovering some new favorite jams along the way.
          </p>
          <h2 id="Closing" className="text-2xl font-semibold mt-10 mb-4">Closing Statement And Acknowledgement</h2>
          <p>
            By continuing to read this, you acknowledge and accept these terms. If you are confused or frustrated, that’s okay—we feel the same way. Thank you for your understanding, and we wish you luck as you navigate the fascinating world of group projects.
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
