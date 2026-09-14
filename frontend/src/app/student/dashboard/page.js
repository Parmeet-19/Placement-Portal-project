'use client';
import {useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import 
{
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import { apiRequest } from '@/lib/api';
export default function StudentDashboard()
{
    const router = useRouter();
    const[tab, setTab] = useState(0);
    const[jobs, setJobs] = useState([]);
    const[applications, setApplications] = useState([]);
    const[error, setError] = useState('');
    const[loading, setLoading] = useState(true);
    const[user, setUser] = useState(null);
    useEffect(() =>
    {
        const storedUser = localStorage.getItem('user');
        if(!storedUser)
        {
            router.push('/login');
            return;
        }setUser(JSON.parse(storedUser));
        loadJobs();
    },[]);

const loadJobs = async () =>
{
    try{
        const data = await apiRequest('/jobs');
   setJobs(data);
    } catch(err)
    {
        setError(err.message);
    }
    finally{
        setLoading(false);
    }
};
const loadApplications = async () =>
{
    try{
        const data = await apiRequest('/applications/student');
        setApplications(data);
    } catch(error)
    {
        setError(err.message);
    }
};
const handleTabChange =(e,newValue) =>
{
    setTab(newValue);
    setError('');
  if(newValue ===1)
  {
    loadApplications();
  }
};

const handleApply = async(jobId) =>
{
    setError('');
    try{
        await apiRequest('/applications', {
            method: 'POST',
            body:JSON.stringify({job_id :jobId})
        });
    alert("Applied successfully!");
    } catch(err)
    {
        setError(err.message);
    }
};
const handleLogout= () =>
{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
};

if(!user)
{
    return null;
}

return (

   <Container maxWidth="md">

      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">
          Welcome, {user.name}
        </Typography>

        <Button onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{ mt: 2 }}
      >
        <Tab label="Browse Jobs" />
        <Tab label="My Applications" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {tab === 0 && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {loading && (
            <Typography>
              Loading jobs...
            </Typography>
          )}

          {!loading && jobs.length === 0 && (
            <Typography>
              No jobs available right now.
            </Typography>
          )}

          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent>

                <Typography variant="h6">
                  {job.title}
                </Typography>

                <Typography color="text.secondary">
                  {job.company_name} — {job.location}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  {job.description}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Salary: ₹{job.salary}
                </Typography>

                <Typography>
                  Type: {job.job_type}
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleApply(job.id)}
                >
                  Apply
                </Button>

              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {tab === 1 && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {applications.length === 0 && (
            <Typography>
              You haven't applied to any jobs yet.
            </Typography>
          )}

          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent>

                <Typography variant="h6">
                  {app.job_title}
                </Typography>

                <Typography color="text.secondary">
                  {app.company_name}
                </Typography>

                <Chip
                  label={app.status}
                  color={
                    app.status === 'selected'
                      ? 'success'
                      : app.status === 'rejected'
                      ? 'error'
                      : app.status === 'shortlisted'
                      ? 'warning'
                      : 'default'
                  }
                  sx={{ mt: 1 }}
                />

              </CardContent>
            </Card>
          ))}
        </Box>
      )}

    </Container>
  );

}