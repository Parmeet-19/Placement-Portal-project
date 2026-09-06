const pool = require('../src/config/db');

exports.createApplication = async (req, res) => {
  const { job_id } = req.body;
  const userId = req.user.id;
  try {
    const studentResult = await pool.query(
      `
      SELECT id FROM students WHERE user_id = $1
      `,
      [userId]
    );
    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Student Profile not found'
      });
    }
    const studentId = studentResult.rows[0].id;

    const result = await pool.query(
      `
      INSERT INTO applications (student_id, job_id)
      VALUES($1,$2)
      RETURNING *
      `,
      [studentId, job_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === '23505') {
      return res.status(409).json({
        error: 'You have already applied to this job'
      });
    }

    res.status(500).json({
      error: 'Failed to submit application'
    });
  }
};
// GET all applications — admin only
exports.getAllApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT applications.*, students.college, jobs.title AS job_title, companies.company_name
      FROM applications
      JOIN students ON applications.student_id = students.id
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
      ORDER BY applications.applied_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// GET logged-in student's own application history
exports.getMyApplications = async (req, res) => {
  const userId = req.user.id;
  try {
    const studentResult = await pool.query(
      `SELECT id FROM students WHERE user_id = $1`,
      [userId]
    );
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentId = studentResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT applications.*, jobs.title AS job_title, companies.company_name
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
      WHERE applications.student_id = $1
      ORDER BY applications.applied_at DESC
      `,
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your applications' });
  }
};

// GET applicants for a specific job — company viewing their own job's applicants
exports.getApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
    const jobCheck = await pool.query(
      `
      SELECT jobs.id FROM jobs
      JOIN companies ON jobs.company_id = companies.id
      WHERE jobs.id = $1 AND companies.user_id = $2
      `,
      [jobId, userId]
    );
    if (jobCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not have access to this job's applicants" });
    }

    const result = await pool.query(
      `
      SELECT applications.*, students.college, students.branch, students.cgpa, users.name AS student_name, users.email
      FROM applications
      JOIN students ON applications.student_id = students.id
      JOIN users ON students.user_id = users.id
      WHERE applications.job_id = $1
      ORDER BY applications.applied_at DESC
      `,
      [jobId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};

// PUT update application status — company updating their own job's applicant
exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const validStatuses = ['applied', 'shortlisted', 'rejected', 'selected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const ownershipCheck = await pool.query(
      `
      SELECT applications.id FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
      WHERE applications.id = $1 AND companies.user_id = $2
      `,
      [id, userId]
    );
    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'You do not have permission to update this application' });
    }

    const result = await pool.query(
      `UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};