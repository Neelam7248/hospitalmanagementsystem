const express=require ("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {addDoctor}=require("../controllers/doctorController");
const auth=require("../middleware/auth");
router.post("/addDoctor",auth,upload.single("profileImage"), addDoctor);
module.exports=router;