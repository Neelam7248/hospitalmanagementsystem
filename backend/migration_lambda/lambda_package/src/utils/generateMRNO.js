const prisma = require("../config/prisma");

const generateMRN = async () => {
  const lastPatient = await prisma.patient.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      medicalRecordNumber: true,
    },
  });

  if (!lastPatient) {
    return "MRN-000001";
  }

  const lastNumber = parseInt(
    lastPatient.medicalRecordNumber.replace("MRN-", ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `MRN-${String(nextNumber).padStart(6, "0")}`;
};

module.exports = generateMRN;