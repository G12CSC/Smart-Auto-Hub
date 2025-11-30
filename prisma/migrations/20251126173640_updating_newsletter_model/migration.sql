/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `NewsletterEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NewsletterEntry" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'GUEST',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterEntry_email_key" ON "NewsletterEntry"("email");
