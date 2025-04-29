"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    const username = (document.getElementById("username") as HTMLInputElement).value
    // Get userID from database
    const result = await fetch("/api/user", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username,
      }),
    });
    // Handle response
    if (result.ok) {
      const data = await result.json();
      console.log("Retrieved user from database with ID:", data.user);
      // SAVE USER IN LOCAL STORAGE TO ACCESS IN OTHER FILES
      localStorage.setItem("userID", data.user.id);
      router.push("/home");
    } else {
      console.error("Failed to retrieve user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <input id="username" placeholder="Username"></input>
      <input id="password" placeholder="Password"></input>
      <button 
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Log In
      </button>
    </div>
  );
}