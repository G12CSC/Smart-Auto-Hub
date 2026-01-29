/*
  Warnings:

  - Added the required column `type` to the `AuthProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthProvider" ADD COLUMN     "id_token" TEXT,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "session_state" TEXT,
ADD COLUMN     "token_type" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT;
