const uploadToCloudinary = require("./cloudinaryUploadLogic");
const uploadToS3 = require("./uploadToS3");
const patientDocumentConfig = require("../config/patientDocumentConfig");

const uploadPatientDocuments = async (files = {}) => {
  let imageUrl = null;
  const uploadedDocuments = [];

  // ==========================
  // Upload Profile Image
  // ==========================
  const profileImage = files?.profileImage?.[0];

  if (profileImage) {
    const uploadedImage = await uploadToCloudinary(profileImage.buffer);
    imageUrl = uploadedImage.secure_url;
  }

  // ==========================
  // Upload All Documents
  // ==========================
  for (const [fieldName, config] 
    of Object.entries(patientDocumentConfig)) {
    const file = files?.[fieldName]?.[0];

    if (!file) continue;

    const uploadedFile = await uploadToS3(file, {
      folder: config.folder,
      allowedTypes: config.allowedTypes,
    });

    uploadedDocuments.push({
      documentType: config.documentType,
      originalName: file.originalname,
      fileName: uploadedFile.fileName,
      fileKey: uploadedFile.fileKey,
      mimeType: uploadedFile.mimeType,
      fileSize: uploadedFile.fileSize,
      documentUrl: uploadedFile.url,
    });
  }

  return {
    imageUrl,
    uploadedDocuments,
  };
};

module.exports = uploadPatientDocuments;