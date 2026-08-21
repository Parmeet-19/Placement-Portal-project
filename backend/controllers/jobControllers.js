const pool = require('../src/config/db');
 
// CREATE
exports.createJob = async (req, res) => {
  const {
    company_id,
    title,
    description,
    location,
    salary,
    job_type,
    deadline
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO jobs(
        company_id,
        title,
        description,
        location,
        salary,
        job_type,
        deadline
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        company_id,
        title,
        description,
        location,
        salary,
        job_type,
        deadline
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create a job' });
  }
};
 
// READ ALL
exports.getAllJobs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT jobs.*, companies.company_name
      FROM jobs
      JOIN companies ON jobs.company_id = companies.id
      ORDER BY jobs.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};
 
// READ ONE
exports.getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT jobs.*, companies.company_name
      FROM jobs
      JOIN companies ON jobs.company_id = companies.id
      WHERE jobs.id = $1
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch the job' });
  }
};
 
// UPDATE
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    salary,
    job_type,
    deadline
  } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE jobs
      SET
        title = $1,
        description = $2,
        location = $3,
        salary = $4,
        job_type = $5,
        deadline = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        title,
        description,
        location,
        salary,
        job_type,
        deadline,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update the job' });
  }
};
 
// DELETE
exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM jobs WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({
      message: 'Job deleted successfully',
      deletedJob: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};