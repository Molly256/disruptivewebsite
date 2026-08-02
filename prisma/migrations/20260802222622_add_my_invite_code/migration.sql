/*
  Warnings:

  - You are about to drop the column `totalBalance` on the `User` table. All the data in the column will be lost.
  - The `vipLevel` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[myInviteCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "account" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "totalBalance",
ADD COLUMN     "activeProducts" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "completedProducts" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "currentSet" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "currentTaskProducts" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "holdAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "lastProfitReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "myInviteCode" TEXT,
ADD COLUMN     "setCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "specialBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "taskCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalTasks" INTEGER NOT NULL DEFAULT 40,
ADD COLUMN     "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
DROP COLUMN "vipLevel",
ADD COLUMN     "vipLevel" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_myInviteCode_key" ON "User"("myInviteCode");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
