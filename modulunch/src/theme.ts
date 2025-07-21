// src/theme.ts
import { createTheme } from '@mui/material/styles'

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d81e5b', // your pink-ish primary color
    },
    background: {
      default: '#f9fafb',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d81e5b',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
})
