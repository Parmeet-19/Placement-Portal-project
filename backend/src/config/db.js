const {Pool} = require("pg");
require("dotenv").config();
const pool = new Pool({
    connectionString: process.env.EXTERNAL_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query("SELECT NOW()",(err, result) => 
{
if(err)
{
    console.error("Database connection failed: ",err);
}
else
{
    console.log("Database connected successfully!");
    console.log("Database time:",result.rows[0]);

}
});
module.exports = pool;