/*
  Warnings:

  - You are about to drop the column `productId` on the `Analytics` table. All the data in the column will be lost.
  - Added the required column `modelId` to the `Analytics` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "ip" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Analytics_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Analytics" ("createdAt", "id", "ip") SELECT "createdAt", "id", "ip" FROM "Analytics";
DROP TABLE "Analytics";
ALTER TABLE "new_Analytics" RENAME TO "Analytics";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
