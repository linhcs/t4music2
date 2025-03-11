import Link from "next/link";
export default function Login() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Log in to Amplifi</h1>
  
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
  
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
  
          <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Sign in
          </button>

        <p className="mt-4 text-gray-600">
            New to Amplifi?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
            Join the party!
            </Link>
        </p>
        </div>
      </div>
    );
  }
  