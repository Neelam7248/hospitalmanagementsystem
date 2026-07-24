const uploadToCloudinary = require("./cloudinaryUploadLogic");
const uploadToS3 = require("./uploadToS3");

const uploadDoctorDocuments = async (files = {}) => {
let imageUrl = null;

let cvData = null;
let degreeData = null;
let licenseData = null;
let certificateData=null;
  // ==========================
  // Profile Image
  // ==========================
  const profileImage = files?.profileImage?.[0];

  if (profileImage) {
    const uploadedImage = await uploadToCloudinary(profileImage.buffer);
    imageUrl = uploadedImage.secure_url;
  }

  // ==========================
  // Doctor CV
  // ==========================
  const cv = files?.cv?.[0];

  if (cv) {
    const uploadedCV = await uploadToS3(cv, {
      folder: "doctor-cv",
      allowedTypes: ["application/pdf"],
    });


    cvData = {originalName: cv.originalname,fileName:uploadedCV.fileName,
        fileKey:uploadedCV.fileKey,mimeType:uploadedCV.mimeType,fileSize:uploadedCV.fileSize};
  }

  // ==========================
  // Degree
  // ==========================
  const degree = files?.degree?.[0];

  if (degree) {
    const uploadedDegree = await uploadToS3(degree, {
      folder: "doctor-degree",
      allowedTypes: ["application/pdf"],
    });

    degreeData ={originalName:degree.originalname,fileName:uploadedDegree.fileName,fileKey:uploadedDegree.fileKey,mimeType:uploadedDegree.mimeType,fileSize:uploadedDegree.fileSize}
  }

  // ==========================
  // Medical License
  // ==========================
  const license = files?.license?.[0];

  if (license) {
    const uploadedLicense = await uploadToS3(license, {
      folder: "doctor-license",
      allowedTypes: ["application/pdf"],
    });

    licenseData = {originalName:license.originalname,fileName:uploadedLicense.fileName,fileKey:uploadedLicense.fileKey,mimeType:uploadedLicense.mimeType,fileSize:uploadedLicense.fileSize}
  }

  // Medical License
  // ==========================
  const certificate = files?.certificate?.[0];

  if (certificate) {
    const uploadedCertificate = await uploadToS3(certificate, {
      folder: "doctor-certificate",
      allowedTypes: ["application/pdf"],
    });

    certificateData = {originalName:certificate.originalname,fileName:uploadedCertificate.fileName,fileKey:uploadedCertificate.fileKey,mimeType:uploadedCertificate.mimeType,fileSize:uploadedCertificate.fileSize}
  }

  return {
    imageUrl,
    cvData,
    degreeData,
    licenseData,
certificateData,
};
};

module.exports = uploadDoctorDocuments;