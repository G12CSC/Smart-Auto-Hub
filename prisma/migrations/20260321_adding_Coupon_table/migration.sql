-- Create Coupon table
CREATE TABLE "Coupon" (
                          "id" TEXT NOT NULL,
                          "couponCode" TEXT NOT NULL,
                          "expireAt" TIMESTAMP(3) NOT NULL,
                          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- Unique constraint
CREATE UNIQUE INDEX "Coupon_couponCode_key" ON "Coupon"("couponCode");

--------------------------------------------------

-- Add couponId to Transaction
ALTER TABLE "Transactions"
    ADD COLUMN "couponId" TEXT;

-- Add FK for Transaction
ALTER TABLE "Transactions"
    ADD CONSTRAINT "Transaction_couponId_fkey"
        FOREIGN KEY ("couponId") REFERENCES "Coupon"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;

--------------------------------------------------

-- Add couponId to Review
ALTER TABLE "Review"
    ADD COLUMN "couponId" TEXT;

-- Add FK for Review
ALTER TABLE "Review"
    ADD CONSTRAINT "Review_couponId_fkey"
        FOREIGN KEY ("couponId") REFERENCES "Coupon"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;