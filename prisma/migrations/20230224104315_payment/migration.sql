/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "contractorId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentStart" DATETIME,
    "rentEnd" DATETIME,
    "rentDays" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "OrderStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("contractorId", "createdAt", "id", "number", "price", "rentDays", "rentEnd", "rentStart", "statusId") SELECT "contractorId", "createdAt", "id", "number", "price", "rentDays", "rentEnd", "rentStart", "statusId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentStatusId" TEXT,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_paymentStatusId_fkey" FOREIGN KEY ("paymentStatusId") REFERENCES "PaymentStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("createdAt", "id", "paymentStatusId", "price") SELECT "createdAt", "id", "paymentStatusId", "price" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
