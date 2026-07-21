const express=require ("express");
const router = express.Router();

const {addDoctor}=require("../controllers/doctorController");
const auth=require("../middleware/auth");
router.post("/addDoctor",addDoctor);
module.exports=router;