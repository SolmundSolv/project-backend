-- CreateTable
CREATE TABLE "ProductStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

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
    "modelId" TEXT,
    "productStatusId" TEXT,
    CONSTRAINT "Product_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_productStatusId_fkey" FOREIGN KEY ("productStatusId") REFERENCES "ProductStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("boughtAt", "createdAt", "id", "modelId", "serialNumer", "updatedAt", "warranty", "warrantyExpiration") SELECT "boughtAt", "createdAt", "id", "modelId", "serialNumer", "updatedAt", "warranty", "warrantyExpiration" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ProductStatus_name_key" ON "ProductStatus"("name");
