import Link from "next/link";

export default function Login() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-black rounded-xl shadow-lg space-y-6 border border-gray-700">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Log in to Amplifi
          </h1>
  
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
          />
  
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
          />
  
          <button className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-300 transition-colors">
            Sign in
          </button>

          <p className="mt-4 text-gray-400">
            New to Amplifi?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Join the party!
            </Link>
          </p>
        </div>
      </div>
    );
}
