-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MaintenanceStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "visibleOnCreate" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_MaintenanceStatus" ("id", "name") SELECT "id", "name" FROM "MaintenanceStatus";
DROP TABLE "MaintenanceStatus";
ALTER TABLE "new_MaintenanceStatus" RENAME TO "MaintenanceStatus";
CREATE UNIQUE INDEX "MaintenanceStatus_name_key" ON "MaintenanceStatus"("name");
CREATE TABLE "new_Maintenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "start" DATETIME,
    "estimatedTime" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT,
    "maintenanceStatusId" TEXT,
    CONSTRAINT "Maintenance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Maintenance_maintenanceStatusId_fkey" FOREIGN KEY ("maintenanceStatusId") REFERENCES "MaintenanceStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Maintenance" ("createdAt", "description", "estimatedTime", "id", "maintenanceStatusId", "price", "productId", "start", "updatedAt") SELECT "createdAt", "description", "estimatedTime", "id", "maintenanceStatusId", "price", "productId", "start", "updatedAt" FROM "Maintenance";
DROP TABLE "Maintenance";
ALTER TABLE "new_Maintenance" RENAME TO "Maintenance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
