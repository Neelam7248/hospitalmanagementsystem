/*
  Warnings:

  - You are about to drop the column `userId` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[medicalRecordNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalRecordNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `maritalStatus` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ADMITTED', 'DISCHARGED', 'DECEASED');

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- DropIndex
DROP INDEX "Patient_userId_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "medicalRecordNumber" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "status" "PatientStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_medicalRecordNumber_key" ON "Patient"("medicalRecordNumber");
