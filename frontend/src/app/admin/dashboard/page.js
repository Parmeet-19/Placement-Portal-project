'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Tabs, Tab
} from '@mui/material';
import { apiRequest } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    loadStudents();
    loadCompanies();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await apiRequest('/students');
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await apiRequest('/companies');
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Admin — Welcome, {user.name}</Typography>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mt: 2 }}>
        <Tab label={`Students (${students.length})`} />
        <Tab label={`Companies (${companies.length})`} />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {students.length === 0 && <Typography>No students registered yet.</Typography>}
          {students.map((s) => (
            <Card key={s.id}>
              <CardContent>
                <Typography variant="h6">{s.student_name}</Typography>
                <Typography color="text.secondary">{s.email}</Typography>
                <Typography sx={{ mt: 1 }}>
                  {s.college} | {s.course} — {s.branch} | Graduating {s.graduation_year} | CGPA: {s.cgpa}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {companies.length === 0 && <Typography>No companies registered yet.</Typography>}
          {companies.map((c) => (
            <Card key={c.id}>
              <CardContent>
                <Typography variant="h6">{c.company_name}</Typography>
                <Typography color="text.secondary">{c.email}</Typography>
                <Typography sx={{ mt: 1 }}>{c.description}</Typography>
                <Typography>{c.location} — {c.website}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}