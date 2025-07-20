'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  // if user is not logged in yet, redirect to login page
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch('/api/session', {
        credentials: 'include',  // send cookies
      })
      if (!res.ok) {
        // Not logged in, redirect to login page
        router.replace('/login')
      }
    }
    checkSession()
  }, [router])

  return (
    <div>
      <h1>Welcome to your dashboard!</h1>
      {/* Your dashboard content here */}
    </div>
  )
}
