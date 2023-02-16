/*
  Warnings:

  - You are about to alter the column `estimatedTime` on the `Maintenance` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Maintenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedTime" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT,
    "maintenanceStatusId" TEXT,
    CONSTRAINT "Maintenance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Maintenance_maintenanceStatusId_fkey" FOREIGN KEY ("maintenanceStatusId") REFERENCES "MaintenanceStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Maintenance" ("createdAt", "description", "estimatedTime", "id", "maintenanceStatusId", "price", "productId", "updatedAt") SELECT "createdAt", "description", "estimatedTime", "id", "maintenanceStatusId", "price", "productId", "updatedAt" FROM "Maintenance";
DROP TABLE "Maintenance";
ALTER TABLE "new_Maintenance" RENAME TO "Maintenance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
