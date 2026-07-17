const multer = require("multer");

const storage = multer.memoryStorage();

const imageValidation=require("../middleware/imageValidation");
const upload = multer({
   storage,
   fileFilter:imageValidation,
   limits: {
      fileSize: 5 * 1024 * 1024
   }
});

module.exports = upload;