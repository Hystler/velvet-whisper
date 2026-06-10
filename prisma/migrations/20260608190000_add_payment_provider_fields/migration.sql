-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "paymentProvider" TEXT,
ADD COLUMN "paymentId" TEXT,
ADD COLUMN "paymentUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");

-- CreateIndex
CREATE INDEX "Order_paymentProvider_idx" ON "Order"("paymentProvider");
