-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KanbanTaskChecklistItemComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskChecklistItemComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTaskChecklistItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskChecklistItemComment" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskChecklistItemComment";
DROP TABLE "KanbanTaskChecklistItemComment";
ALTER TABLE "new_KanbanTaskChecklistItemComment" RENAME TO "KanbanTaskChecklistItemComment";
CREATE TABLE "new_KanbanTaskChecklistItemAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskChecklistItemAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTaskChecklistItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskChecklistItemAttachment" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskChecklistItemAttachment";
DROP TABLE "KanbanTaskChecklistItemAttachment";
ALTER TABLE "new_KanbanTaskChecklistItemAttachment" RENAME TO "KanbanTaskChecklistItemAttachment";
CREATE TABLE "new_KanbanTaskChecklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskChecklistItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTaskChecklist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskChecklistItem" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskChecklistItem";
DROP TABLE "KanbanTaskChecklistItem";
ALTER TABLE "new_KanbanTaskChecklistItem" RENAME TO "KanbanTaskChecklistItem";
CREATE TABLE "new_KanbanTaskCommentAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskCommentAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTaskComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskCommentAttachment" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskCommentAttachment";
DROP TABLE "KanbanTaskCommentAttachment";
ALTER TABLE "new_KanbanTaskCommentAttachment" RENAME TO "KanbanTaskCommentAttachment";
CREATE TABLE "new_KanbanTaskCommentLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskCommentLabel_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTaskComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskCommentLabel" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskCommentLabel";
DROP TABLE "KanbanTaskCommentLabel";
ALTER TABLE "new_KanbanTaskCommentLabel" RENAME TO "KanbanTaskCommentLabel";
CREATE TABLE "new_KanbanTaskChecklistItemLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskChecklistItemLabel_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTaskChecklistItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskChecklistItemLabel" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskChecklistItemLabel";
DROP TABLE "KanbanTaskChecklistItemLabel";
ALTER TABLE "new_KanbanTaskChecklistItemLabel" RENAME TO "KanbanTaskChecklistItemLabel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
