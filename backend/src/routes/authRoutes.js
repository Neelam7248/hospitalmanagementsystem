const express = require("express");
const router = express.Router();
const auth=require("../middleware/auth");
const { registerUser, signIn ,getProfile,updateProfile, passwordChange, changeEmail} = require("../controllers/authController");

const upload = require("../middleware/multer");

router.post("/register",upload.fields([
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
  },
]), registerUser);
router.post("/signIn",signIn);
router.get("/getProfile",auth,getProfile);
router.post("/updateProfile",auth,updateProfile);
router.post("/passwordChange",auth,passwordChange);
router.put("/changeEmail",auth,changeEmail);
module.exports = router;