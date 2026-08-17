const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/health", ( req,res) =>
{
  res.json(
    {
        message: "Placement portal is running"

    }
  );
});

module.exports =app;