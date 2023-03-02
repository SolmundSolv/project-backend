/*
  Warnings:

  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `invoiceId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Invoice_number_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Invoice";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PaymentStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
    "paymentId" TEXT,
    "rentDays" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "OrderStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("contractorId", "createdAt", "id", "number", "price", "rentDays", "rentEnd", "rentStart", "statusId") SELECT "contractorId", "createdAt", "id", "number", "price", "rentDays", "rentEnd", "rentStart", "statusId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");
CREATE TABLE "new_CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Model" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("cartId", "createdAt", "id", "productId") SELECT "cartId", "createdAt", "id", "productId" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL NOT NULL,
    "paymentStatusId" TEXT,
    CONSTRAINT "Payment_paymentStatusId_fkey" FOREIGN KEY ("paymentStatusId") REFERENCES "PaymentStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("createdAt", "id", "price") SELECT "createdAt", "id", "price" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
