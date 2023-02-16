-- CreateTable
CREATE TABLE "MaintenanceDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "maintenanceId" TEXT,
    CONSTRAINT "MaintenanceDetails_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
