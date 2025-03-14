"use client";
import Signup from "@/components/ui/signup";

export default function SignupPage() {
  const createUser = async () => {
    let result = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "user2",
        password_hash: "password1",
      }),
    });
    console.log(result);
    console.log("This is before the error jsonning");
    const response = await result.json();
    console.log(response);
  };

  return (
    <div>
      <button
        onClick={() => {
          createUser();
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Cick Me
      </button>
      <Signup />
    </div>
  );
}
