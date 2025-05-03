"use client";

import { useRouter } from "next/navigation";
import { useLoggedIn } from "../contexts";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const { setUsername } = useLoggedIn();
  const [inputUsername, setInputUsername] = useState("");

  const handleLogin = () => {
    setUsername(inputUsername);
    router.push("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        className="inputUserPass"
        id="username"
        placeholder="Username"
        value={inputUsername}
        onChange={(e) => setInputUsername(e.target.value)}
      />
      <input className="inputUserPass" id="password" placeholder="Password" type="password" />
      <button 
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Log In
      </button>
    </div>
  );
}