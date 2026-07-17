const express = require("express");
const router = express.Router();
const auth=require("../middleware/auth");
const { registerUser, signIn ,getProfile,updateProfile, passwordChange} = require("../controllers/authController");

const upload = require("../middleware/multer");
const imageValidation = require("../middleware/imageValidation");
router.post("/register",upload.single("profileImage"), registerUser);
router.post("/signIn",signIn);
router.get("/getProfile",auth,getProfile);
router.post("/updateProfile",auth,updateProfile);
router.post("/passwordChange",auth,passwordChange);
module.exports = router;