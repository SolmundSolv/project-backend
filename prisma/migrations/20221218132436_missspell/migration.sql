/*
  Warnings:

  - You are about to drop the column `modelId` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "serialNumer" TEXT NOT NULL DEFAULT 'XXXX-XXXX-XXXX-XXXX',
    "boughtAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warrantyExpiration" DATETIME,
    "warranty" TEXT,
    "productStatusId" TEXT,
    CONSTRAINT "Product_productStatusId_fkey" FOREIGN KEY ("productStatusId") REFERENCES "ProductStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("boughtAt", "createdAt", "id", "productStatusId", "serialNumer", "updatedAt", "warranty", "warrantyExpiration") SELECT "boughtAt", "createdAt", "id", "productStatusId", "serialNumer", "updatedAt", "warranty", "warrantyExpiration" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Product',
    "price" DECIMAL NOT NULL DEFAULT 0,
    "img" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT 'Descripton',
    "categoryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderId" TEXT,
    "productId" TEXT,
    CONSTRAINT "Model_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Model_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Model_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Model" ("categoryId", "description", "id", "img", "isActive", "name", "orderId", "price") SELECT "categoryId", "description", "id", "img", "isActive", "name", "orderId", "price" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
