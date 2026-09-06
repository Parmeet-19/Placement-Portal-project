const express = require("express");

const app = express();
const jobRoutes = require('../routes/jobRoutes');
const studentRoutes = require('../routes/studentRoutes');
const companyRoutes = require('../routes/companyRoutes');
const authRoutes = require('../routes/authRoutes');
const applicationRoutes = require('../routes/applicationRoutes');
app.use(express.json());

app.get("/api/health", ( req,res) =>
{
  res.json(
    {
        message: "Placement portal is running"

    }
  );
});
app.use("/api/jobs", jobRoutes);
app.use("/api/students",studentRoutes);
app.use("/api/companies",companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
module.exports =app;