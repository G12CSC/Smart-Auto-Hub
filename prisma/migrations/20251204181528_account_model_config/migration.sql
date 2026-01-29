/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerAvatar` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerEmail` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerName` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerUserId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerAccountId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_provider_providerUserId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accessToken",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "providerAvatar",
DROP COLUMN "providerEmail",
DROP COLUMN "providerName",
DROP COLUMN "providerUserId",
DROP COLUMN "refreshToken",
DROP COLUMN "updatedAt",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "expires_at" INTEGER,
ADD COLUMN     "providerAccountId" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
