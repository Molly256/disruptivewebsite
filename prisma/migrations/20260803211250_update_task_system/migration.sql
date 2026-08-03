/*
  Warnings:

  - You are about to drop the column `currentSet` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `setCompleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentSet",
DROP COLUMN "setCompleted",
ADD COLUMN     "setsCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tasksInCurrentSet" INTEGER NOT NULL DEFAULT 0;
