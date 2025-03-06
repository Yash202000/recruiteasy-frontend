'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = 
        mode === 'login' 
          ? { email, password } 
          : { username, email, password };
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        if (mode === 'login') {
          alert('Logged in successfully!');
          router.push('/dashboard'); // Navigate to dashboard or home
        } else {
          alert('Account created successfully!');
          router.push('/login'); // Navigate to login page
        }
      } else {
        // Handle errors returned from the API
        alert(`Error: ${result.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md w-full max-w-md"
        >
        <h2 className="text-xl font-bold mb-4">
            {mode === 'login' ? 'Login to Your Account' : 'Create an Account'}
        </h2>
        {mode === 'signup' && (
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                Username
            </label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-500"
            />
            </div>
        )}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
            </label>
            <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-500"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
            </label>
            <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-500"
            />
        </div>
        <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring"
        >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
        <p className="text-sm text-center mt-4">
            {mode === 'login' ? (
            <>
                Don't have an account?{' '}
                <a href="/signup" className="text-indigo-600 hover:underline">
                Sign Up
                </a>
            </>
            ) : (
            <>
                Already have an account?{' '}
                <a href="/login" className="text-indigo-600 hover:underline">
                Login
                </a>
            </>
            )}
        </p>
    </form>

  );
}
