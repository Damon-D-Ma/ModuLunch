'use client'

import { Container, Typography, Box } from '@mui/material'

export default function SignupPage() {
  return (
    <Container sx={{ py: 8, maxWidth: 'sm' }}>
      <Typography variant="h4" fontWeight="semibold" gutterBottom>
        Sign Up
      </Typography>

      <Box
        sx={{
          mt: 4,
          // Add your form component here or build form elements below
        }}
      >
        {/* TODO: Add signup form here */}
      </Box>
    </Container>
  )
}
