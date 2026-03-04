/*
  Warnings:

  - Added the required column `updatedAt` to the `worklogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `worklogs` ADD COLUMN `state` VARCHAR(191) NOT NULL DEFAULT 'TERMINADO',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
