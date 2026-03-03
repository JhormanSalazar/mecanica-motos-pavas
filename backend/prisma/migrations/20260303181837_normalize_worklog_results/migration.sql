/*
  Warnings:

  - You are about to drop the column `results` on the `worklog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `worklog` DROP COLUMN `results`;

-- CreateTable
CREATE TABLE `WorkLogResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workLogId` INTEGER NOT NULL,
    `checklistItemId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `obs` TEXT NULL,

    INDEX `WorkLogResult_workLogId_idx`(`workLogId`),
    INDEX `WorkLogResult_checklistItemId_idx`(`checklistItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkLogResult` ADD CONSTRAINT `WorkLogResult_workLogId_fkey` FOREIGN KEY (`workLogId`) REFERENCES `WorkLog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkLogResult` ADD CONSTRAINT `WorkLogResult_checklistItemId_fkey` FOREIGN KEY (`checklistItemId`) REFERENCES `ChecklistItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
