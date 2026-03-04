-- DropForeignKey
ALTER TABLE `worklog_results` DROP FOREIGN KEY `worklog_results_checklistItemId_fkey`;

-- AlterTable
ALTER TABLE `worklog_results` ADD COLUMN `isCustom` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `checklistItemId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `worklog_results` ADD CONSTRAINT `worklog_results_checklistItemId_fkey` FOREIGN KEY (`checklistItemId`) REFERENCES `checklist_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
