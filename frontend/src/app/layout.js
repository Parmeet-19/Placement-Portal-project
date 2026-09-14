'use client';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './globals.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}