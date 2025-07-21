'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
} from '@mui/material'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)

  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/session', { credentials: 'include' })
      if (res.ok) {
        router.replace('/dashboard')
      }
    }
    checkSession()
  }, [router])

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
      setShowError(true)
    }
  }

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false)
        setError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showError])

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Login
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
          fullWidth
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Sign In
        </Button>

        {showError && error && <Alert severity="error">{error}</Alert>}

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Don&apos;t have an account?{' '}
          <MuiLink component={Link} href="/signup" underline="hover" color="primary">
            Sign Up
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  )
}
