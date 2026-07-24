const createDoctorDocuments = (
  doctorId,
  cvData,
  degreeData,
  licenseData,
  certificateData,
) => {
  return [
    {
      doctorId,
      documentType: "CV",
      originalName: cvData.originalName,
      fileName: cvData.fileName,
      fileKey: cvData.fileKey,
      mimeType: cvData.mimeType,
      fileSize: cvData.fileSize,
    },
    {
      doctorId,
      documentType: "DEGREE",
      originalName: degreeData.originalName,
      fileName: degreeData.fileName,
      fileKey: degreeData.fileKey,
      mimeType: degreeData.mimeType,
      fileSize: degreeData.fileSize,
    },
    {
      doctorId,
      documentType: "LICENSE",
      originalName: licenseData.originalName,
      fileName: licenseData.fileName,
      fileKey: licenseData.fileKey,
      mimeType: licenseData.mimeType,
      fileSize: licenseData.fileSize,
    },
    {
      doctorId,
      documentType: "CERTIFICATE",
      originalName: certificateData.originalName,
      fileName: certificateData.fileName,
      fileKey: certificateData.fileKey,
      mimeType: certificateData.mimeType,
      fileSize: certificateData.fileSize,
    },

];
};

module.exports = createDoctorDocuments;