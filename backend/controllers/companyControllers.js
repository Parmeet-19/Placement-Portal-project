const pool = require('../src/config/db');

// CREATE
exports.createCompany = async (req, res) => {
  const {
    user_id,
    company_name,
    description,
    website,
    location
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO companies (
        user_id,
        company_name,
        description,
        website,
        location
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        user_id,
        company_name,
        description,
        website,
        location
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create company' });
  }
};

// READ ALL
exports.getAllCompanies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT companies.*, users.email
      FROM companies
      JOIN users ON companies.user_id = users.id
      ORDER BY companies.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

// READ ONE
exports.getCompanyById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT companies.*, users.email
      FROM companies
      JOIN users ON companies.user_id = users.id
      WHERE companies.id = $1
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

// UPDATE
exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    description,
    website,
    location
  } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE companies
      SET
        company_name = $1,
        description = $2,
        website = $3,
        location = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        company_name,
        description,
        website,
        location,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update company' });
  }
};

// DELETE
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM companies WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({
      message: 'Company deleted successfully',
      deletedCompany: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete company' });
  }
};