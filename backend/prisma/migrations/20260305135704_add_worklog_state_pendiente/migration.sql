/*
  Warnings:

  - You are about to alter the column `state` on the `worklogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `worklogs` MODIFY `state` ENUM('PENDIENTE', 'EN_PROCESO', 'TERMINADO') NOT NULL DEFAULT 'TERMINADO',
    ALTER COLUMN `updatedAt` DROP DEFAULT;
