'use client'

import { Container, Typography, Box } from '@mui/material'

export default function ProfilePage() {
  return (
    <Container sx={{ py: 8, maxWidth: 'md' }}>
      <Typography variant="h4" fontWeight="semibold" gutterBottom>
        Your Profile
      </Typography>

      <Box
        sx={{
          mt: 4,
          // Add your profile form or profile info display here
        }}
      >
        {/* TODO: Profile form or view */}
      </Box>
    </Container>
  )
}
