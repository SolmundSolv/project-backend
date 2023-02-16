-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KanbanTaskComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "employeeId" TEXT,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskComment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "KanbanTaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskComment" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskComment";
DROP TABLE "KanbanTaskComment";
ALTER TABLE "new_KanbanTaskComment" RENAME TO "KanbanTaskComment";
CREATE TABLE "new_KanbanTaskChecklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "KanbanTaskChecklistItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTaskChecklist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KanbanTaskChecklistItem" ("createdAt", "id", "name", "taskId") SELECT "createdAt", "id", "name", "taskId" FROM "KanbanTaskChecklistItem";
DROP TABLE "KanbanTaskChecklistItem";
ALTER TABLE "new_KanbanTaskChecklistItem" RENAME TO "KanbanTaskChecklistItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
