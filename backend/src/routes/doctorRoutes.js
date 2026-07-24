const express=require ("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {addDoctor,getAllDoctors,getDoctorById}=require("../controllers/doctorController");
const auth=require("../middleware/auth");
router.post("/addDoctor",auth,upload.fields([
  {
    name: "profileImage",
    maxCount: 1,
  },
  {
    name: "cv",
    maxCount: 1,
  },
  {
    name: "degree",
    maxCount: 1,
  },
  {
    name: "license",
    maxCount: 1,
  },{
    name: "certificate",
    maxCount: 1,
  },
]), addDoctor);

router.get("/getAllDoctors", auth, getAllDoctors);

router.get("/:id", auth, getDoctorById);
module.exports=router;