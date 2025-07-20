'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from 'next/link'


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false)

  const router = useRouter();


  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/session', {
        credentials: 'include',
      });
      if (res.ok) {
        router.replace('/dashboard');
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pw }),
      credentials: 'include',
    })

    if (res.ok) {
      window.location.href = '/dashboard'
    } else {
      const data = await res.json()
      setError(data.error || 'Login failed')
      setShowError(true) // show popup error
    }
  }

  // Hide error popup automatically after 3 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false)
        setError(null)
      }, 3000)
      return () => clearTimeout(timer) // cleanup timer if component unmounts
    }
  }, [showError])



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            variant="outlined"
          />

          <Button variant="contained" color="primary" fullWidth type="submit">
            Sign In
          </Button>

          {showError && error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded text-sm text-center shadow">
              {error}
            </div>
          )}
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don&rsquo;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}