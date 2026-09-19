const patientDocumentConfig = {
  medicalReport: {
    folder: "patient-medical-report",
    documentType: "MEDICAL_REPORT",
    allowedTypes: ["application/pdf"],
  },

  prescription: {
    folder: "patient-prescription",
    documentType: "PRESCRIPTION",
    allowedTypes: ["application/pdf"],
  },

  labReport: {
    folder: "patient-lab-report",
    documentType: "LAB_REPORT",
    allowedTypes: ["application/pdf"],
  },

  xray: {
    folder: "patient-xray",
    documentType: "XRAY",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },

  mri: {
    folder: "patient-mri",
    documentType: "MRI",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },

  ctScan: {
    folder: "patient-ct-scan",
    documentType: "CT_SCAN",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },

  ultrasound: {
    folder: "patient-ultrasound",
    documentType: "ULTRASOUND",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },

  insurance: {
    folder: "patient-insurance",
    documentType: "INSURANCE",
    allowedTypes: ["application/pdf"],
  },

  idProof: {
    folder: "patient-id-proof",
    documentType: "ID_PROOF",
    allowedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ],
  },

  other: {
    folder: "patient-other",
    documentType: "OTHER",
    allowedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ],
  },
};

module.exports = patientDocumentConfig;