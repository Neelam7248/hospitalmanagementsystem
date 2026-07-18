const express = require("express");
const router = express.Router();
const auth=require("../middleware/auth");
const { registerUser, signIn ,getProfile,updateProfile, passwordChange, changeEmail} = require("../controllers/authController");

const upload = require("../middleware/multer");

router.post("/register",upload.single("profileImage"), registerUser);
router.post("/signIn",signIn);
router.get("/getProfile",auth,getProfile);
router.post("/updateProfile",auth,updateProfile);
router.post("/passwordChange",auth,passwordChange);
router.put("/changeEmail",auth,changeEmail);
module.exports = router;