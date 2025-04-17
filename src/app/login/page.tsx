"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Optional: simulate login logic here
    router.push("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <input className="inputUserPass" id="username" placeholder="Username"></input>
      <input className="inputUserPass" id="password" placeholder="Password"></input>
      <button 
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Log In
      </button>
    </div>
  );
}