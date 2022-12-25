/*
  Warnings:

  - You are about to drop the column `state` on the `Employee` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "avatar" TEXT,
    "password" TEXT,
    "token" TEXT,
    "lastLogin" DATETIME,
    "positionId" TEXT,
    "salaryId" TEXT,
    "bonus" TEXT,
    CONSTRAINT "Employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "EmployeeRole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Employee_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "Salary" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Employee" ("address", "avatar", "bonus", "city", "country", "createdAt", "email", "id", "lastLogin", "name", "password", "phone", "positionId", "roleId", "salaryId", "status", "token", "zip") SELECT "address", "avatar", "bonus", "city", "country", "createdAt", "email", "id", "lastLogin", "name", "password", "phone", "positionId", "roleId", "salaryId", "status", "token", "zip" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
