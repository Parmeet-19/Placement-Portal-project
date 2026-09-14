'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';

import { apiRequest } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'student') {
        router.push('/student/dashboard');
      } else if (data.user.role === 'company') {
        router.push('/company/dashboard');
      } else if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h4">
          Login
        </Typography>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}