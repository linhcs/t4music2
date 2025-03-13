"use client"; // telling next.js this is a client component
import { useState, ChangeEvent, FormEvent } from "react"; // uses react hook (useState), (ChangeEvent) ensures we handle input field changes, (FormEvent) handling form submission events
import Link from "next/link"; // nagivating between pages without reloading full page

export default function Signup() { // default functional component 
    const [formData, setFormData] = useState({ //form data with empty username, email, and pw & setFormData will update formData when user types in form
        email: "",
        username: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => { // dynamically updates correct field (email, user or pw)
        setFormData({ ...formData, [e.target.name]: e.target.value }); 
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { // keeps previous state while updating just the changed field
        e.preventDefault();

        try {
            const response = await fetch("/api/signup", { 
                method: "POST",// POST will send data to server
                headers: { "Content-Type": "application/json" }, // tells server we're sending JSON 
                body: JSON.stringify(formData), // converts formData into JSON format before sending
            });

            if (response.ok) { // if response is successful/true its going to alert user (i added note)
                alert("Signup successful! Redirecting..."); // tells user they're being redirected if success
                window.location.href = "/login";// redirects user to login page 
            } else {
                alert("Signup failed. Please try again."); // otherwise its going to show an error message
            }
        } catch (error) {
            console.error("Error signing up:", error); // or if something goes wrong it's going to log an error in the message console
        }
    };
 // this is just pretty ui stuff ee eee 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
            <div className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-black rounded-xl shadow-lg space-y-6 border border-gray-700">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                    Sign up for Amplifi
                </h1>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"/>
                    <input type="text" name="username" placeholder="Create Username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"/>
                    <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"/>
                    <button type="submit" className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-300 transition-colors">Sign up</button>
                </form>

                <p className="mt-4 text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
