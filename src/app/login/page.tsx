"use client"; // Ensure this component is treated as a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct hook for Next.js App Router
import InputField from "../reusable-components/InputField";
import Button from "../reusable-components/Button";

export default function Login() {
  const [username, setUsername] = useState("normal");
  const [password, setPassword] = useState("normal");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    setError(""); // Reset error message on each login attempt

    if (username === "superadmin" && password === "superadmin") {
      router.push("/super-admin");
    } else if (username === "admin" && password === "admin") {
      router.push("/org-admin");
    } else if (username === "normal" && password === "normal") {
      router.push("/generate");
    } else {
      setError("Invalid credentials");
    }
  };

  // Change the event type to the native KeyboardEvent
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          User Login
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <InputField
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button onClick={handleLogin}>Login</Button>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
