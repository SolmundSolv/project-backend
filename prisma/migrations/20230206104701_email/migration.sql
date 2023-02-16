/*
  Warnings:

  - You are about to drop the column `message` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Email` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Email" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "emailTemplateId" TEXT,
    CONSTRAINT "Email_emailTemplateId_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "EmailTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Email" ("createdAt", "email", "id") SELECT "createdAt", "email", "id" FROM "Email";
DROP TABLE "Email";
ALTER TABLE "new_Email" RENAME TO "Email";
CREATE TABLE "new_EmailTemplateVariable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "emailTemplateId" TEXT,
    CONSTRAINT "EmailTemplateVariable_emailTemplateId_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "EmailTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_EmailTemplateVariable" ("createdAt", "id", "name", "value") SELECT "createdAt", "id", "name", "value" FROM "EmailTemplateVariable";
DROP TABLE "EmailTemplateVariable";
ALTER TABLE "new_EmailTemplateVariable" RENAME TO "EmailTemplateVariable";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
