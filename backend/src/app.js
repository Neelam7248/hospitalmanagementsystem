const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const doctorRoutes=require ("./routes/doctorRoutes");
const patientRoutes=require("./routes/patientRoutes")
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctor",doctorRoutes);
app.use("/api/v1/patient",patientRoutes);
module.exports = app;