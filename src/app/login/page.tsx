'use client'; // Ensure this component is treated as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct hook for Next.js App Router

export default function Login() {
  const [username, setUsername] = useState('normal');
  const [password, setPassword] = useState('normal');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'superadmin' && password === 'superadmin') {
      router.push('/super-admin');
    } else if (username === 'admin' && password === 'admin') {
      router.push('/org-admin');
    } else if (username === 'normal' && password === 'normal') {
      router.push('/generate');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => 
            {
                debugger;
                setUsername(e.target.value)}
            }
        style={{ margin: '5px', padding: '10px', width: '200px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: '5px', padding: '10px', width: '200px' }}
      />
      <button onClick={handleLogin} style={{ margin: '10px', padding: '10px', width: '100px' }}>
        Login
      </button>

    </div>
  );
}
