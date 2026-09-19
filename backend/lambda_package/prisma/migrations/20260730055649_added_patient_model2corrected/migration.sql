/*
  Warnings:

  - The values [ADMITTED,DISCHARGED] on the enum `PatientStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PatientStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'DECEASED');
ALTER TABLE "public"."Patient" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Patient" ALTER COLUMN "status" TYPE "PatientStatus_new" USING ("status"::text::"PatientStatus_new");
ALTER TYPE "PatientStatus" RENAME TO "PatientStatus_old";
ALTER TYPE "PatientStatus_new" RENAME TO "PatientStatus";
DROP TYPE "public"."PatientStatus_old";
ALTER TABLE "Patient" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
