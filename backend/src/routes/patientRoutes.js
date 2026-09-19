const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

const {
  addPatient,
} = require("../controllers/patientController");

router.post(
  "/addPatient",
  auth,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "medicalReport",
      maxCount: 1,
    },
    {
      name: "prescription",
      maxCount: 1,
    },
    {
      name: "labReport",
      maxCount: 1,
    },
    {
      name: "xray",
      maxCount: 1,
    },
    {
      name: "mri",
      maxCount: 1,
    },
    {
      name: "ctScan",
      maxCount: 1,
    },
    {
      name: "ultrasound",
      maxCount: 1,
    },
    {
      name: "insurance",
      maxCount: 1,
    },
    {
      name: "idProof",
      maxCount: 1,
    },
    {
      name: "other",
      maxCount: 5,
    },
  ]),
  addPatient
);

module.exports = router;