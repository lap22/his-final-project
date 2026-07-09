ALTER TABLE "public"."PatientProfile"
  ADD COLUMN IF NOT EXISTS "relationship" TEXT,
  ADD COLUMN IF NOT EXISTS "medicalHistory" TEXT;
