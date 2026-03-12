CREATE TABLE "AdvisorProfile" (
                                  "id" TEXT NOT NULL,
                                  "adminId" TEXT NOT NULL,
                                  "phone" TEXT,
                                  "specialization" TEXT,
                                  "experience" TEXT,
                                  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
                                  "avatar" TEXT,
                                  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" TIMESTAMP NOT NULL,

                                  CONSTRAINT "AdvisorProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdvisorProfile_adminId_key"
    ON "AdvisorProfile"("adminId");

ALTER TABLE "AdvisorProfile"
    ADD CONSTRAINT "AdvisorProfile_adminId_fkey"
        FOREIGN KEY ("adminId") REFERENCES "Admin"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;