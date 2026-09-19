
const uploadToCloudinary = require("./cloudinaryUploadLogic");
const uploadToS3 = require("./uploadToS3");

const uploadDoctorDocuments = async (files = {}) => {

  const profileImage = files.profileImage;
  const cv = files.cv;
  const degree = files.degree;
  const license = files.license;
  const certificate = files.certificate;

  // =====================================================
  // START ALL UPLOADS IN PARALLEL
  // =====================================================

  const profileImagePromise = profileImage
    ? uploadToCloudinary(profileImage.buffer)
    : Promise.resolve(null);

  const cvPromise = cv
    ? uploadToS3(cv, {
        folder: "doctor-cv",
        allowedTypes: ["application/pdf"],
      })
    : Promise.resolve(null);

  const degreePromise = degree
    ? uploadToS3(degree, {
        folder: "doctor-degree",
        allowedTypes: ["application/pdf"],
      })
    : Promise.resolve(null);

  const licensePromise = license
    ? uploadToS3(license, {
        folder: "doctor-license",
        allowedTypes: ["application/pdf"],
      })
    : Promise.resolve(null);

  const certificatePromise = certificate
    ? uploadToS3(certificate, {
        folder: "doctor-certificate",
        allowedTypes: ["application/pdf"],
      })
    : Promise.resolve(null);

  // =====================================================
  // WAIT FOR ALL UPLOADS
  // =====================================================

  const [
    uploadedImage,
    uploadedCV,
    uploadedDegree,
    uploadedLicense,
    uploadedCertificate,
  ] = await Promise.all([
    profileImagePromise,
    cvPromise,
    degreePromise,
    licensePromise,
    certificatePromise,
  ]);

  // =====================================================
  // PREPARE RETURN DATA
  // =====================================================

  const imageUrl = uploadedImage
    ? uploadedImage.secure_url
    : null;

  const cvData = uploadedCV
    ? {
        originalName: cv.originalname,
        fileName: uploadedCV.fileName,
        fileKey: uploadedCV.fileKey,
        mimeType: uploadedCV.mimeType,
        fileSize: uploadedCV.fileSize,
        documentUrl: uploadedCV.url,
      }
    : null;

  const degreeData = uploadedDegree
    ? {
        originalName: degree.originalname,
        fileName: uploadedDegree.fileName,
        fileKey: uploadedDegree.fileKey,
        mimeType: uploadedDegree.mimeType,
        fileSize: uploadedDegree.fileSize,
        documentUrl: uploadedDegree.url,
      }
    : null;

  const licenseData = uploadedLicense
    ? {
        originalName: license.originalname,
        fileName: uploadedLicense.fileName,
        fileKey: uploadedLicense.fileKey,
        mimeType: uploadedLicense.mimeType,
        fileSize: uploadedLicense.fileSize,
        documentUrl: uploadedLicense.url,
      }
    : null;

  const certificateData = uploadedCertificate
    ? {
        originalName: certificate.originalname,
        fileName: uploadedCertificate.fileName,
        fileKey: uploadedCertificate.fileKey,
        mimeType: uploadedCertificate.mimeType,
        fileSize: uploadedCertificate.fileSize,
        documentUrl: uploadedCertificate.url,
      }
    : null;

  // =====================================================
  // RETURN
  // =====================================================

  return {
    imageUrl,
    cvData,
    degreeData,
    licenseData,
    certificateData,
  };
};

module.exports = uploadDoctorDocuments;

