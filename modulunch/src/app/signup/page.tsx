'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material'
import axios from 'axios'

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    pw: '',
    email: '',
    gender: '',
    school: '',
    major: '',
    year: '',
    dietaryRestrictions: '',
    favouriteCuisines: '',
    bio: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/session', { credentials: 'include' })
        if (res.ok) router.replace('/dashboard')
      } catch (err) {
        console.error('Session check failed:', err)
      }
    }
    checkSession()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await axios.post('/api/register', formData, { withCredentials: true })

      if (res.data.success) {
        router.replace('/dashboard')
      } else {
        setError(res.data.error || 'Registration failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error during registration')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="semibold" align="center" gutterBottom>
        Sign Up
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

    <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
    </Box>
    <Box mt={2}>
      <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} required />
    </Box>
    <Box mt={2}>
      <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} required />
    </Box>
    <Box mt={2}>
      <TextField fullWidth type="password" label="Password" name="pw" value={formData.pw} onChange={handleChange} required />
    </Box>

    <Box mt={2} display="flex" gap={2} alignItems="center">
      <TextField
        label="School"
        name="school"
        value={formData.school}
        onChange={handleChange}
        required
        sx={{ flexGrow: 1 }}
      />
      <TextField
        select
        label="Year"
        name="year"
        value={formData.year}
        onChange={handleChange}
        required
        sx={{ width: 120 }} // fixed width
      >
        <MenuItem value="1">1</MenuItem>
        <MenuItem value="2">2</MenuItem>
        <MenuItem value="3">3</MenuItem>
        <MenuItem value="4">4</MenuItem>
        <MenuItem value="5">5+</MenuItem>
      </TextField>
    </Box>



<Box mt={2}>
  <TextField
    fullWidth
    multiline
    rows={3}
    label="Bio"
    name="bio"
    value={formData.bio}
    onChange={handleChange}
  />
</Box>
<Box mt={2}>
  <TextField
    fullWidth
    multiline
    rows={2}
    label="Dietary Restrictions"
    name="dietaryRestrictions"
    value={formData.dietaryRestrictions}
    onChange={handleChange}
    placeholder="e.g. Vegetarian, Gluten-Free"
  />
</Box>
<Box mt={2}>
  <TextField
    fullWidth
    multiline
    rows={2}
    label="Favourite Cuisines"
    name="favouriteCuisines"
    value={formData.favouriteCuisines}
    onChange={handleChange}
    placeholder="e.g. Korean BBQ, Sushi, Italian"
  />
</Box>
<Box mt={4}>
  <Button type="submit" variant="contained" fullWidth>
    Register
  </Button>
</Box>


      </Box>
    </Container>
  )
}
