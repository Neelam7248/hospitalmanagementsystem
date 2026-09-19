
const createPatientDocuments = (patientId, uploadedDocuments) => {
  return uploadedDocuments.map((document) => ({
    patientId,
    ...document,
  }));
};

module.exports = createPatientDocuments;