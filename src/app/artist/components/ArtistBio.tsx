"use client";
import { useState } from 'react';

interface artistbiotype {
  bio: string;
}

export default function ArtistBio({ bio }: artistbiotype) {
  console.log(bio);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-10 w-full max-w-3xl bg-gray-900 rounded-2xl p-6 shadow-xl">
      <h3 className="text-2xl font-semibold mb-3">About the Artist</h3>
      <p className="text-gray-300 text-base">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        {expanded && (
          <>
            {" "}Mauris quis nisi eros. Suspendisse vitae erat vel nibh tincidunt vestibulum quis vel sem. Integer semper est nec quam pharetra tristique. Vivamus non lacus eros. Praesent vulputate sodales consequat.
          </>
        )}
        <button
          className="text-white underline ml-1 font-semibold"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      </p>
    </div>
  );
}
