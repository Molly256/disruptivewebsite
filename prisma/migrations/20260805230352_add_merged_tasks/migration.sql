-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mergedTasks" JSONB NOT NULL DEFAULT '[]';
