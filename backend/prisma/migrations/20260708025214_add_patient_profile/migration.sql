-- AlterTable
ALTER TABLE "public"."PatientProfile" RENAME CONSTRAINT "Patient_pkey" TO "PatientProfile_pkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "roleId" SET DEFAULT 3;
