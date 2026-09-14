'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert
} from '@mui/material';

import { apiRequest } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState('student');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    course: '',
    branch: '',
    graduation_year: '',
    cgpa: '',
    resume_url: '',
    company_name: '',
    description: '',
    website: '',
    location: ''
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
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role
      };

      if (role === 'student') {
        Object.assign(payload, {
          college: formData.college,
          course: formData.course,
          branch: formData.branch,
          graduation_year: formData.graduation_year,
          cgpa: formData.cgpa,
          resume_url: formData.resume_url
        });
      } else if (role === 'company') {
        Object.assign(payload, {
          company_name: formData.company_name,
          description: formData.description,
          website: formData.website,
          location: formData.location
        });
      }

      await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      router.push('/login');
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
          Sign Up
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
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="student">
                Student
              </MenuItem>

              <MenuItem value="company">
                Company
              </MenuItem>
            </TextField>

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

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

            {role === 'student' && (
              <>
                <TextField
                  label="College"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                />

                <TextField
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                />

                <TextField
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                />

                <TextField
                  label="Graduation Year"
                  name="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={handleChange}
                />

                <TextField
                  label="CGPA"
                  name="cgpa"
                  type="number"
                  value={formData.cgpa}
                  onChange={handleChange}
                />

                <TextField
                  label="Resume URL"
                  name="resume_url"
                  value={formData.resume_url}
                  onChange={handleChange}
                />
              </>
            )}

            {role === 'company' && (
              <>
                <TextField
                  label="Company Name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                />

                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <TextField
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />

                <TextField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}