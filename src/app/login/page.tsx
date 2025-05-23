"use client";

import { useRouter } from "next/navigation";
import { useLoggedIn } from "../contexts";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const { setUser } = useLoggedIn();
  const [inputUsername, setInputUsername] = useState("");

  const handleLogin = async () => {
    const result = await fetch("/api/user", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: inputUsername,
      }),
    });
    // Handle response
    if (result.ok) {
      const data = await result.json();
      console.log("Retrieved user from database with ID:", data.user);
      setUser(data.user);
    } else {
      console.error("Failed to retrieve user");
    }
    router.push("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h1>
        <div className="space-y-4">
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="password"
            type="password"
            placeholder="Password (Optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
