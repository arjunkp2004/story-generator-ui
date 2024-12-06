'use client'; // Ensure this component is treated as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct hook for Next.js App Router

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    setError(''); // Reset error message on each login attempt

    if (username === 'superadmin' && password === 'superadmin') {
      router.push('/super-admin');
    } else if (username === 'admin' && password === 'admin') {
      router.push('/org-admin');
    } else if (username === 'normal' && password === 'normal') {
      router.push('/generate');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
        
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
