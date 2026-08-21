const bcrypt = require('bcrypt');
const pool = require('../src/config/db');
const jwt = require('jsonwebtoken');
exports.signup = async(req,res) =>  //SIGNUP
{
   const{ name, email, password, role, ... profileData} = req.body;
   const client = await pool.connect();

   try{
   await client.query('BEGIN');
const hashedPassword = await bcrypt.hash(password,10);

const userResult = await client.query(`
    INSERT INTO users (name, email, password, role)
    VALUES($1,$2,$3,$4)
    RETURNING id, name, email, role`,
    [name, email, hashedPassword, role]
);
const newUser = userResult.rows[0];
if(role === 'student')
{
    await client.query(
        ` INSERT INTO students(
        user_id,
        college,
        course,
        branch,
        graduation_year,
        cgpa,
        resume_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
            newUser.id,
            profileData.college,
            profileData.course,
            profileData.branch,
            profileData.graduation_year,
            profileData.cgpa,
            profileData.resume_url
        ]
    );
}  else if( role === 'company')
{
    await client.query(
        `INSERT INTO companies (
        user_id,
        company_name,
        description,
        website,
        location
      )
      VALUES ($1,$2,$3,$4,$5)`,
      [
         newUser.id,
          profileData.company_name,
          profileData.description,
          profileData.website,
          profileData.location
      ]
    );
}
await client.query('COMMIT');
res.status(201).json({
      message: 'Signup successful',
      user: newUser
    });
   }
   
   catch(err){
  await client.query('ROLLBACK');
  console.error(err);
   if (err.code === '23505') {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }
    res.status(500).json({error:'signup failed'});
   }
   finally{
    client.release();
   }
};


exports.login = async(req,res) =>    //LOGIN 
{
  const{ email, password} = req.body;

  try{
  const result = await pool.query(
    `SELECT * FROM users WHERE EMAIL = $1`,
    [email]
  );
  if(result.rows.length === 0)
  {
    return res.status(400).json(
        {
            error:'Invalid email pr password'
        }
    );
  }
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(
 password,
 user.password
  );
  if(!isMatch)
  {
    return res.status(401).json({
        error: 'Invalid email or password'
      });
  }
  const token = jwt.sign(
    {
        id:user.id,
        role : user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn : '7d'
    }
  );
   res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }
  catch(err)
  {
  console.error(err);

    res.status(500).json({
      error: 'Login failed'
    });
  }
};