/*
  Warnings:

  - Added the required column `message` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Email" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "emailTemplateId" TEXT,
    CONSTRAINT "Email_emailTemplateId_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "EmailTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Email" ("createdAt", "email", "emailTemplateId", "id") SELECT "createdAt", "email", "emailTemplateId", "id" FROM "Email";
DROP TABLE "Email";
ALTER TABLE "new_Email" RENAME TO "Email";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
