/*
  Warnings:

  - You are about to drop the column `myInviteCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referralCode` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `inviteCode` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_myInviteCode_key";

-- DropIndex
DROP INDEX "User_referralCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "myInviteCode",
DROP COLUMN "referralCode",
ADD COLUMN     "referredBy" TEXT,
ALTER COLUMN "inviteCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_inviteCode_key" ON "User"("inviteCode");
