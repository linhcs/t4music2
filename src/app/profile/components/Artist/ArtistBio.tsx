"use client";
import { useState } from "react";

export default function ArtistBio() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-6 w-full max-w-4xl bg-gray-900 rounded-2xl p-6 shadow-lg">
      <h3 className="text-3xl font-semibold mb-4">About Me</h3>
      <p className="text-gray-300 text-lg leading-relaxed">
        I am an artist passionate about creating soulful music that connects with people.
        {expanded && (
          <>
            {" "}
            My journey started from humble beginnings and evolved through experimentation
            and passion. I strive to blend genres and bring a fresh perspective with
            every track.
          </>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white underline ml-2 font-semibold hover:text-indigo-400 transition-colors"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      </p>
    </div>
  );
}
