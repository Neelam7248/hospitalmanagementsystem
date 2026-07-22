const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const doctorRoutes=require ("./routes/doctorRoutes");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctor",doctorRoutes);

module.exports = app;