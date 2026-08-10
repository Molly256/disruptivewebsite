/*
  Warnings:

  - You are about to drop the column `price` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `totalProfit` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "totalPrice",
DROP COLUMN "totalProfit",
ADD COLUMN     "products" JSONB NOT NULL DEFAULT '[]';
