import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <h1 className="font-thin text-[8rem] md:text-[12rem] leading-none font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/70">
            Amplifi
          </h1>
          <p className="text-white/60 tracking-[0.3em] uppercase text-sm">
            Music Streaming
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="rounded-full px-8 bg-white text-black hover:bg-white/90 min-w-[160px]"
            >
              Sign Up
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-black border-white/20 hover:bg-white/10 min-w-[160px]"
            >
              Log In
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <div>© 2024 Amplifi. All rights reserved.</div>
          <nav className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
