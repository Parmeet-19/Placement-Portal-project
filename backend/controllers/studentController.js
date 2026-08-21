const pool = require('../src/config/db');

// CREATE
exports.createStudent = async (req, res) => {
  const {
    user_id,
    college,
    course,
    branch,
    graduation_year,
    cgpa,
    resume_url
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO students (
        user_id,
        college,
        course,
        branch,
        graduation_year,
        cgpa,
        resume_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        user_id,
        college,
        course,
        branch,
        graduation_year,
        cgpa,
        resume_url
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create a student' });
  }
};

// READ ALL
exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT students.*, users.name AS student_name, users.email
      FROM students
      JOIN users ON students.user_id = users.id
      ORDER BY students.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// READ ONE
exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT students.*, users.name AS student_name, users.email
      FROM students
      JOIN users ON students.user_id = users.id
      WHERE students.id = $1
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// UPDATE
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    college,
    course,
    branch,
    graduation_year,
    cgpa,
    resume_url
  } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE students
      SET
        college = $1,
        course = $2,
        branch = $3,
        graduation_year = $4,
        cgpa = $5,
        resume_url = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        college,
        course,
        branch,
        graduation_year,
        cgpa,
        resume_url,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// DELETE
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM students WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({
      message: 'Student deleted successfully',
      deletedStudent: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};