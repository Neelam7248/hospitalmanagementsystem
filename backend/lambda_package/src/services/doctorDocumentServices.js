const createDoctorDocuments = (
  doctorId,
  cvData,
  degreeData,
  licenseData,
  certificateData
) => {
  const documents = [];

  if (cvData) {
    documents.push({
      doctorId,
      documentType: "CV",
      originalName: cvData.originalName,
      fileName: cvData.fileName,
      fileKey: cvData.fileKey,
      mimeType: cvData.mimeType,
      fileSize: cvData.fileSize,
      documentUrl: cvData.documentUrl,
    });
  }

  if (degreeData) {
    documents.push({
      doctorId,
      documentType: "DEGREE",
      originalName: degreeData.originalName,
      fileName: degreeData.fileName,
      fileKey: degreeData.fileKey,
      mimeType: degreeData.mimeType,
      fileSize: degreeData.fileSize,
      documentUrl: degreeData.documentUrl,
    });
  }

  if (licenseData) {
    documents.push({
      doctorId,
      documentType: "LICENSE",
      originalName: licenseData.originalName,
      fileName: licenseData.fileName,
      fileKey: licenseData.fileKey,
      mimeType: licenseData.mimeType,
      fileSize: licenseData.fileSize,
      documentUrl: licenseData.documentUrl,
    });
  }

  if (certificateData) {
    documents.push({
      doctorId,
      documentType: "CERTIFICATE",
      originalName: certificateData.originalName,
      fileName: certificateData.fileName,
      fileKey: certificateData.fileKey,
      mimeType: certificateData.mimeType,
      fileSize: certificateData.fileSize,
      documentUrl: certificateData.documentUrl,
    });
  }

  return documents;
};

module.exports = createDoctorDocuments;