-- CreateTable
CREATE TABLE "_EmployeeToKanbanTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EmployeeToKanbanTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EmployeeToKanbanTask_B_fkey" FOREIGN KEY ("B") REFERENCES "KanbanTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToKanbanTask_AB_unique" ON "_EmployeeToKanbanTask"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToKanbanTask_B_index" ON "_EmployeeToKanbanTask"("B");
