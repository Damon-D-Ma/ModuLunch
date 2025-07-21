'use client'

import { Container, Typography, Grid, Card, CardContent } from '@mui/material'

export default function DiscoverPage() {
  // Example placeholder data for students
  const students = [
    { id: 1, name: 'Alice Johnson', major: 'Computer Science' },
    { id: 2, name: 'Bob Smith', major: 'Engineering' },
    { id: 3, name: 'Charlie Lee', major: 'Mathematics' },
  ]

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="semibold" gutterBottom>
        Discover Students
      </Typography>

      <Grid container spacing={4}>
        {students.map((student) => (
          <Grid item key={student.id} xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">{student.name}</Typography>
                <Typography color="text.secondary">{student.major}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
