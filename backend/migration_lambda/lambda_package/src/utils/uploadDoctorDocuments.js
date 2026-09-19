const uploadToCloudinary = require("./cloudinaryUploadLogic");
const uploadToS3 = require("./uploadToS3");

const uploadDoctorDocuments = async (files = {}) => {

  let imageUrl = null;

  let cvData = null;
  let degreeData = null;
  let licenseData = null;
  let certificateData = null;


  // =====================================================
  // PROFILE IMAGE → CLOUDINARY
  // =====================================================

  const profileImage = files.profileImage;

  if (profileImage) {

    const uploadedImage =
      await uploadToCloudinary(profileImage.buffer);

    imageUrl = uploadedImage.secure_url;
  }


  // =====================================================
  // CV → S3
  // =====================================================

  const cv = files.cv;

  if (cv) {

    const uploadedCV = await uploadToS3(cv, {

      folder: "doctor-cv",

      allowedTypes: [
        "application/pdf"
      ],

    });


    cvData = {

      originalName: cv.originalname,

      fileName: uploadedCV.fileName,

      fileKey: uploadedCV.fileKey,

      mimeType: uploadedCV.mimeType,

      fileSize: uploadedCV.fileSize,

      documentUrl: uploadedCV.url,

    };
  }


  // =====================================================
  // DEGREE → S3
  // =====================================================

  const degree = files.degree;

  if (degree) {

    const uploadedDegree =
      await uploadToS3(degree, {

        folder: "doctor-degree",

        allowedTypes: [
          "application/pdf"
        ],

      });


    degreeData = {

      originalName: degree.originalname,

      fileName: uploadedDegree.fileName,

      fileKey: uploadedDegree.fileKey,

      mimeType: uploadedDegree.mimeType,

      fileSize: uploadedDegree.fileSize,

      documentUrl: uploadedDegree.url,

    };
  }


  // =====================================================
  // MEDICAL LICENSE → S3
  // =====================================================

  const license = files.license;

  if (license) {

    const uploadedLicense =
      await uploadToS3(license, {

        folder: "doctor-license",

        allowedTypes: [
          "application/pdf"
        ],

      });


    licenseData = {

      originalName: license.originalname,

      fileName: uploadedLicense.fileName,

      fileKey: uploadedLicense.fileKey,

      mimeType: uploadedLicense.mimeType,

      fileSize: uploadedLicense.fileSize,

      documentUrl: uploadedLicense.url,

    };
  }


  // =====================================================
  // CERTIFICATE → S3
  // =====================================================

  const certificate = files.certificate;

  if (certificate) {

    const uploadedCertificate =
      await uploadToS3(certificate, {

        folder: "doctor-certificate",

        allowedTypes: [
          "application/pdf"
        ],

      });


    certificateData = {

      originalName: certificate.originalname,

      fileName: uploadedCertificate.fileName,

      fileKey: uploadedCertificate.fileKey,

      mimeType: uploadedCertificate.mimeType,

      fileSize: uploadedCertificate.fileSize,

      documentUrl: uploadedCertificate.url,

    };
  }


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