/*
  Warnings:

  - A unique constraint covering the columns `[tag_id]` on the table `cattle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,userId]` on the table `productitem` will be added. If there are existing duplicate values, this will fail.

*/

-- AlterTable
ALTER TABLE `cattle` MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `price` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `productitem` MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- CreateIndex (use lowercase table names)
CREATE UNIQUE INDEX `cattle_tag_id_key` ON `cattle`(`tag_id`);

-- CreateIndex (use lowercase table names)
CREATE UNIQUE INDEX `productitem_productId_userId_key` ON `productitem`(`productId`, `userId`);
