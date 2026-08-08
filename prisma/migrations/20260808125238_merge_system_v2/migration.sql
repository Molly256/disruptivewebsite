/*
  Warnings:

  - You are about to drop the column `photoIds` on the `TaskMerge` table. All the data in the column will be lost.
  - Added the required column `pairs` to the `TaskMerge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskMerge" DROP COLUMN "photoIds",
ADD COLUMN     "pairs" JSONB NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "TaskMerge_userId_idx" ON "TaskMerge"("userId");

-- CreateIndex
CREATE INDEX "TaskMerge_vipSet_idx" ON "TaskMerge"("vipSet");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");
