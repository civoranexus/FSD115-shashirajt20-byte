-- AlterTable
ALTER TABLE `productitem` ADD COLUMN `reject_reason` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'ACTIVE', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX `ProductItem_status_idx` ON `ProductItem`(`status`);
