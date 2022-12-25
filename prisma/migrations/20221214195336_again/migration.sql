-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Analytics_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Analytics" ("createdAt", "id", "ip", "modelId") SELECT "createdAt", "id", "ip", "modelId" FROM "Analytics";
DROP TABLE "Analytics";
ALTER TABLE "new_Analytics" RENAME TO "Analytics";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
