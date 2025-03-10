"use client";

export default function UserCard() {
  return (
    <div className="relative w-full bg-gradient-to-b from-gray-800 to-black">
      <div className="h-48 flex items-end px-8 pb-6">
        {/* Avatar + User Info */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <img
            src="/ed.jpeg"
            alt="User Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
          />

          {/* Text Info */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-white">User</h2>
            <p className="text-gray-300 text-sm">1.2M Followers • 120 Following</p>
            <p className="text-gray-400 text-sm mt-1">Short bio or tagline goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
