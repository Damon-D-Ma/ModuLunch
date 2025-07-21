'use client'

import { Container, Typography, Box } from '@mui/material'

export default function LogoutPage() {
  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Thank you for Using ModuLunch!
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Logout successful!
      </Typography>
    </Container>
  )
}
