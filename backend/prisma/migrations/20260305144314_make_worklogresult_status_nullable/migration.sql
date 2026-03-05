/*
  Warnings:

  - You are about to alter the column `status` on the `worklog_results` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `type` on the `worklogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `worklog_results` MODIFY `status` ENUM('SI', 'NO') NULL;

-- AlterTable
ALTER TABLE `worklogs` MODIFY `type` ENUM('ALISTAMIENTO', 'REPARACION') NOT NULL,
    MODIFY `state` ENUM('PENDIENTE', 'EN_PROCESO', 'TERMINADO') NOT NULL DEFAULT 'PENDIENTE',
    ALTER COLUMN `updatedAt` DROP DEFAULT;
