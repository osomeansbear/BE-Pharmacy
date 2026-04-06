-- Migration: redesign_order_flow
-- 1. Migrate PROCESSING → CONFIRMED, RETURNED → DELIVERED before removing them from the enum
-- 2. Shrink OrderStatus enum to: PENDING, CONFIRMED, DELIVERED, CANCELLED
-- 3. Make userEmail nullable on Order
-- 4. Add guestName and guestPhone columns to Order

-- Step 1: data-safe downgrade of removed statuses
UPDATE "Order" SET "status" = 'CONFIRMED' WHERE "status" = 'PROCESSING';
UPDATE "Order" SET "status" = 'DELIVERED'  WHERE "status" = 'RETURNED';

-- Step 2: replace the enum type (PostgreSQL requires create-rename-alter-drop)
-- Drop the column default first because it is typed against the old enum
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE "OrderStatus"
  USING "status"::text::"OrderStatus";
DROP TYPE "OrderStatus_old";
-- Restore the default using the new enum type
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- Step 3: make userEmail nullable
ALTER TABLE "Order" ALTER COLUMN "userEmail" DROP NOT NULL;

-- Step 4: add guest columns
ALTER TABLE "Order" ADD COLUMN "guestName"  TEXT;
ALTER TABLE "Order" ADD COLUMN "guestPhone" TEXT;
