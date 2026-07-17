const imageValidation = (req, file, cb) => {
 console.log(file);
   console.log("Mimetype:", file.mimetype);
  console.log("Original Name:", file.originalname);
    const allowedTypes = ["image/jpeg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG images are allowed"), false);
  }
};
module.exports=imageValidation