'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

type NavbarProps = {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
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
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Logo / Brand */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            sx={{ color: 'primary.main', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ModuLunch
          </Typography>
        </Link>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, ml: 4 }}>
          <Stack direction="row" spacing={3}>
            {['dashboard', 'discover', 'schedule', 'profile'].map((page) => (
              <Link
                key={page}
                href={`/${page}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Button color="primary" sx={{ textTransform: 'none', fontWeight: 'medium' }}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Button>
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Dark mode toggle button */}
        <IconButton color="inherit" onClick={toggleDarkMode} sx={{ mr: 2 }}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* Login / Logout */}
        {loggedIn ? (
          <Button color="primary" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="primary">Login</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  )
}
