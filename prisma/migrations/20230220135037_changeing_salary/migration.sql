/*
  Warnings:

  - You are about to drop the column `salaryId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Salary` table. All the data in the column will be lost.
  - You are about to alter the column `basic` on the `Salary` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `bonus` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payDate` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxes` to the `Salary` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SalaryStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

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
    "positionId" TEXT,
    "bonus" TEXT,
    "userId" TEXT,
    CONSTRAINT "Employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "EmployeeRole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Employee" ("address", "avatar", "bonus", "city", "country", "createdAt", "email", "id", "name", "phone", "positionId", "roleId", "status", "userId", "zip") SELECT "address", "avatar", "bonus", "city", "country", "createdAt", "email", "id", "name", "phone", "positionId", "roleId", "status", "userId", "zip" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE TABLE "new_Salary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "basic" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL,
    "taxes" INTEGER NOT NULL,
    "payDate" DATETIME NOT NULL,
    "employeeId" TEXT NOT NULL,
    "currencyId" TEXT,
    "salaryStatusId" TEXT,
    CONSTRAINT "Salary_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Salary_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Salary_salaryStatusId_fkey" FOREIGN KEY ("salaryStatusId") REFERENCES "SalaryStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Salary" ("basic", "createdAt", "id") SELECT "basic", "createdAt", "id" FROM "Salary";
DROP TABLE "Salary";
ALTER TABLE "new_Salary" RENAME TO "Salary";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
