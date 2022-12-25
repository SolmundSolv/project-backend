/*
  Warnings:

  - You are about to drop the column `date` on the `TimeOffRequest` table. All the data in the column will be lost.
  - Added the required column `end` to the `TimeOffRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `TimeOffRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `TimeOffRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeOffRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "requestStatusId" TEXT,
    CONSTRAINT "TimeOffRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeOffRequest_requestStatusId_fkey" FOREIGN KEY ("requestStatusId") REFERENCES "RequestStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TimeOffRequest" ("createdAt", "employeeId", "id", "requestStatusId") SELECT "createdAt", "employeeId", "id", "requestStatusId" FROM "TimeOffRequest";
DROP TABLE "TimeOffRequest";
ALTER TABLE "new_TimeOffRequest" RENAME TO "TimeOffRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
