'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Alert,
  Select,
  Chip
} from '@mui/material';

import { apiRequest } from '@/lib/api';

export default function CompanyDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applicantsByJob, setApplicantsByJob] = useState({});

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    job_type: 'full-time',
    deadline: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);
    loadCompanyAndJobs(parsedUser.email);
  }, []);

  const loadCompanyAndJobs = async (email) => {
    try {
      const companies = await apiRequest('/companies');

      const myCompany = companies.find(
        (c) => c.email === email
      );

      if (!myCompany) {
        setError('Company profile not found');
        return;
      }

      setCompanyId(myCompany.id);

      const allJobs = await apiRequest('/jobs');

      const myJobs = allJobs.filter(
        (j) => j.company_id === myCompany.id
      );

      setJobs(myJobs);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJobFormChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      await apiRequest('/jobs', {
        method: 'POST',
        body: JSON.stringify({
          ...jobForm,
          company_id: companyId
        })
      });

      setSuccess('Job posted successfully!');

      setJobForm({
        title: '',
        description: '',
        location: '',
        salary: '',
        job_type: 'full-time',
        deadline: ''
      });

      loadCompanyAndJobs(user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadApplicants = async (jobId) => {
    try {
      const data = await apiRequest(
        `/applications/job/${jobId}`
      );

      setApplicantsByJob({
        ...applicantsByJob,
        [jobId]: data
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (
    applicationId,
    newStatus,
    jobId
  ) => {
    try {
      await apiRequest(
        `/applications/${applicationId}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      loadApplicants(jobId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">

      {/* Header */}
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

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}

      {/* Post Job Section */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Post a New Job
      </Typography>

      <form onSubmit={handlePostJob}>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            label="Title"
            name="title"
            value={jobForm.title}
            onChange={handleJobFormChange}
            required
          />

          <TextField
            label="Description"
            name="description"
            value={jobForm.description}
            onChange={handleJobFormChange}
            multiline
            rows={3}
            required
          />

          <TextField
            label="Location"
            name="location"
            value={jobForm.location}
            onChange={handleJobFormChange}
            required
          />

          <TextField
            label="Salary"
            name="salary"
            type="number"
            value={jobForm.salary}
            onChange={handleJobFormChange}
            required
          />

          <TextField
            select
            label="Job Type"
            name="job_type"
            value={jobForm.job_type}
            onChange={handleJobFormChange}
          >
            <MenuItem value="full-time">
              Full-time
            </MenuItem>

            <MenuItem value="part-time">
              Part-time
            </MenuItem>

            <MenuItem value="internship">
              Internship
            </MenuItem>

            <MenuItem value="contract">
              Contract
            </MenuItem>
          </TextField>

          <TextField
            label="Deadline"
            name="deadline"
            type="date"
            value={jobForm.deadline}
            onChange={handleJobFormChange}
            InputLabelProps={{
              shrink: true
            }}
            required
          />

          <Button
            type="submit"
            variant="contained"
          >
            Post Job
          </Button>
        </Box>
      </form>

      {/* My Jobs Section */}
      <Typography variant="h5" sx={{ mt: 6 }}>
        My Jobs
      </Typography>

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {jobs.length === 0 && (
          <Typography>
            You haven't posted any jobs yet.
          </Typography>
        )}

        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent>

              <Typography variant="h6">
                {job.title}
              </Typography>

              <Typography color="text.secondary">
                {job.location} — {job.job_type}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                {job.description}
              </Typography>

              <Button
                sx={{ mt: 2 }}
                onClick={() => loadApplicants(job.id)}
              >
                View Applicants
              </Button>

              {/* Applicants */}
              {applicantsByJob[job.id] && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {applicantsByJob[job.id].length === 0 && (
                    <Typography color="text.secondary">
                      No applicants yet.
                    </Typography>
                  )}

                  {applicantsByJob[job.id].map((app) => (
                    <Box
                      key={app.id}
                      sx={{
                        p: 2,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box>
                        <Typography>
                          {app.student_name} — {app.email}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {app.college} | {app.branch} | CGPA: {app.cgpa}
                        </Typography>
                      </Box>

                      {/* Application Status */}
                      <Select
                        value={app.status}
                        size="small"
                        onChange={(e) =>
                          handleStatusChange(
                            app.id,
                            e.target.value,
                            job.id
                          )
                        }
                      >
                        <MenuItem value="applied">
                          Applied
                        </MenuItem>

                        <MenuItem value="shortlisted">
                          Shortlisted
                        </MenuItem>

                        <MenuItem value="rejected">
                          Rejected
                        </MenuItem>

                        <MenuItem value="selected">
                          Selected
                        </MenuItem>
                      </Select>
                    </Box>
                  ))}
                </Box>
              )}

            </CardContent>
          </Card>
        ))}
      </Box>

    </Container>
  );
}