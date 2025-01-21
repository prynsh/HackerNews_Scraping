/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Article` table. All the data in the column will be lost.
  - Added the required column `publishedAt` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` DROP COLUMN `createdAt`,
    ADD COLUMN `publishedAt` DATETIME(3) NOT NULL;
