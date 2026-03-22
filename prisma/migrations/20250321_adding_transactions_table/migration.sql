CREATE TABLE "Transactions" (
                               "id" TEXT NOT NULL,
                               "buyerName" TEXT NOT NULL,
                               "buyerEmail" TEXT NOT NULL,
                               "phone" TEXT NOT NULL,
                               "location" TEXT NOT NULL,
                               "price" DOUBLE PRECISION NOT NULL,

                               "carId" TEXT NOT NULL,
                               "userId" TEXT NOT NULL,

                               "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Transactions"
    ADD CONSTRAINT "Transaction_carId_fkey"
        FOREIGN KEY ("carId") REFERENCES "Car"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Transactions"
    ADD CONSTRAINT "Transaction_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Review"
    ADD COLUMN "location" TEXT NOT NULL;