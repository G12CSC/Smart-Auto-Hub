ALTER TABLE "ConsultationBooking"
DROP COLUMN IF EXISTS "adminMessage",
  ADD COLUMN IF NOT EXISTS "advisorMessage" TEXT,
     ADD COLUMN IF NOT EXISTS "advisorId" TEXT;


ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'FORWARDED';


CREATE TABLE IF NOT EXISTS "AdvisorAvailability" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "advisorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "isBusy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdvisorAvailability_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AdvisorAvailability_advisorId_fkey"
    FOREIGN KEY ("advisorId") REFERENCES "Admin"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
    );


