'use client'

import { useParams } from 'next/navigation'
import { Container, Typography, Box } from '@mui/material'

export default function MatchDetailPage() {
  const params = useParams()
  const matchId = params.id

  return (
    <Container sx={{ py: 8, maxWidth: 'md' }}>
      <Typography variant="h4" fontWeight="semibold" gutterBottom>
        Lunch Match Details
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={4}>
        Match ID: {matchId}
      </Typography>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
          p: 3,
          minHeight: 200,
        }}
      >
        {/* TODO: Render match info, profile preview, lunch plan here */}
      </Box>
    </Container>
  )
}
