const express=require ("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {addDoctor,getAllDoctors,getDoctorById,viewDoctorDocument,editDoctor, deleteDoctor,getDeletedDoctors,restoreDoctor}=require("../controllers/doctorController");
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
router.get("/getDeletedDoctors",auth,getDeletedDoctors)

router.get("/:id", auth, getDoctorById);

router.get(
  "/document/:id",
  auth,
  viewDoctorDocument
);
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  editDoctor
);
router.delete("/deleteDoctor/:id",auth,deleteDoctor);
router.put(
    "/restoreDoctor/:id",
    auth,
    restoreDoctor
);


module.exports=router;