'use client'

import { Container, Typography, Box } from '@mui/material'

export default function SchedulePage() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="semibold" gutterBottom>
        Set Your Availability
      </Typography>
      
      <Box
        sx={{
          mt: 4,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
          minHeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          fontStyle: 'italic',
        }}
      >
        {/* TODO: Add your calendar or time selector component here */}
        Calendar / Time Selector Placeholder
      </Box>
    </Container>
  )
}
