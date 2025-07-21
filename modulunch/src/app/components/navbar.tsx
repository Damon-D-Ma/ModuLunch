'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/session', { credentials: 'include' })
        setLoggedIn(res.ok)
      } catch {
        setLoggedIn(false)
      }
    }
    checkSession()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setLoggedIn(false)
    window.location.href = '/' // redirect to home after logout
  }

  if (loggedIn === null) return null // loading state

  return (
    <nav className="bg-white shadow p-4 flex gap-6 items-center">
      <Link href="/" className="font-bold text-lg text-pink-600">ModuLunch</Link>
      <Link href="/dashboard" className="hover:text-pink-500">Dashboard</Link>
      <Link href="/discover" className="hover:text-pink-500">Discover</Link>
      <Link href="/schedule" className="hover:text-pink-500">Schedule</Link>
      <Link href="/profile" className="hover:text-pink-500">Profile</Link>

      <div className="ml-auto">
        {loggedIn ? (
          <button onClick={handleLogout} className="text-pink-600 hover:text-pink-800">
            Logout
          </button>
        ) : (
          <Link href="/login" className="text-pink-600 hover:text-pink-800">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
