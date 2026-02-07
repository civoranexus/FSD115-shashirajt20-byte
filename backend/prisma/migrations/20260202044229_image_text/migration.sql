-- AlterTable
ALTER TABLE `cattle` MODIFY `image` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `image` TEXT NULL;

-- AlterTable
ALTER TABLE `productitem` MODIFY `image` TEXT NULL;

-- CreateIndex
CREATE INDEX `ProductItem_productId_idx` ON `ProductItem`(`productId`);

-- RenameIndex
ALTER TABLE `cattle` RENAME INDEX `cattle_tag_id_key` TO `Cattle_tag_id_key`;

-- RenameIndex
ALTER TABLE `productitem` RENAME INDEX `ProductItem_userId_fkey` TO `ProductItem_userId_idx`;

-- RenameIndex
ALTER TABLE `productitem` RENAME INDEX `productitem_productId_userId_key` TO `ProductItem_productId_userId_key`;
