-- 1️⃣ Create Advisor table
CREATE TABLE "Advisor" (
                           "advisorId" TEXT NOT NULL,
                           "adminId" TEXT NOT NULL,
                           "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
                           "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT "Advisor_pkey" PRIMARY KEY ("advisorId"),
                           CONSTRAINT "Advisor_adminId_key" UNIQUE ("adminId")
);

-- 2️⃣ Add foreign key: Advisor → Admin
ALTER TABLE "Advisor"
    ADD CONSTRAINT "Advisor_adminId_fkey"
        FOREIGN KEY ("adminId")
            REFERENCES "Admin"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE;
