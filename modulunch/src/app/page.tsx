'use client'

import { Button, Container, Typography, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Welcome to ModuLunch 🍱
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Find friends to have lunch with — fast, fun, and spontaneous.
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button variant="contained" color="primary" size="large" onClick={() => router.push('/signup')}>
          Get Started
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={() => router.push('/login')}>
          Log In
        </Button>
      </Stack>
    </Container>
  )
}
