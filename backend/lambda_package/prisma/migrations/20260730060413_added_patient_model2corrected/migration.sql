-- CreateIndex
CREATE INDEX "Doctor_specialization_idx" ON "Doctor"("specialization");

-- CreateIndex
CREATE INDEX "Doctor_isDeleted_idx" ON "Doctor"("isDeleted");

-- CreateIndex
CREATE INDEX "Doctor_isAvailable_idx" ON "Doctor"("isAvailable");

-- CreateIndex
CREATE INDEX "DoctorDocument_doctorId_idx" ON "DoctorDocument"("doctorId");

-- CreateIndex
CREATE INDEX "Patient_firstName_idx" ON "Patient"("firstName");

-- CreateIndex
CREATE INDEX "Patient_lastName_idx" ON "Patient"("lastName");

-- CreateIndex
CREATE INDEX "Patient_status_idx" ON "Patient"("status");

-- CreateIndex
CREATE INDEX "Patient_isDeleted_idx" ON "Patient"("isDeleted");

-- CreateIndex
CREATE INDEX "Patient_bloodGroup_idx" ON "Patient"("bloodGroup");

-- CreateIndex
CREATE INDEX "PatientDocument_patientId_idx" ON "PatientDocument"("patientId");

-- CreateIndex
CREATE INDEX "User_firstName_idx" ON "User"("firstName");

-- CreateIndex
CREATE INDEX "User_lastName_idx" ON "User"("lastName");
