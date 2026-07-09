-- Rename Patient to PatientProfile and allow one user to own many profiles.
ALTER TABLE "public"."Appointment" DROP CONSTRAINT IF EXISTS "Appointment_patientId_fkey";
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT IF EXISTS "MedicalRecord_patientId_fkey";
ALTER TABLE "public"."AIChatHistory" DROP CONSTRAINT IF EXISTS "AIChatHistory_patientId_fkey";
ALTER TABLE "public"."Patient" DROP CONSTRAINT IF EXISTS "Patient_userId_fkey";

DROP INDEX IF EXISTS "public"."Patient_userId_key";

ALTER TABLE "public"."Patient" RENAME TO "PatientProfile";

ALTER TABLE "public"."PatientProfile"
  ADD COLUMN IF NOT EXISTS "fullName" TEXT NOT NULL DEFAULT 'Family member',
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "gender" "public"."Gender",
  ADD COLUMN IF NOT EXISTS "birthday" TIMESTAMP(3);

ALTER TABLE "public"."PatientProfile"
  ALTER COLUMN "fullName" DROP DEFAULT;

ALTER TABLE "public"."Appointment" RENAME COLUMN "patientId" TO "patientProfileId";
ALTER TABLE "public"."MedicalRecord" RENAME COLUMN "patientId" TO "patientProfileId";
ALTER TABLE "public"."AIChatHistory" RENAME COLUMN "patientId" TO "patientProfileId";

CREATE INDEX IF NOT EXISTS "PatientProfile_userId_idx" ON "public"."PatientProfile"("userId");

ALTER TABLE "public"."PatientProfile"
  ADD CONSTRAINT "PatientProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Appointment"
  ADD CONSTRAINT "Appointment_patientProfileId_fkey"
  FOREIGN KEY ("patientProfileId") REFERENCES "public"."PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."MedicalRecord"
  ADD CONSTRAINT "MedicalRecord_patientProfileId_fkey"
  FOREIGN KEY ("patientProfileId") REFERENCES "public"."PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."AIChatHistory"
  ADD CONSTRAINT "AIChatHistory_patientProfileId_fkey"
  FOREIGN KEY ("patientProfileId") REFERENCES "public"."PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
