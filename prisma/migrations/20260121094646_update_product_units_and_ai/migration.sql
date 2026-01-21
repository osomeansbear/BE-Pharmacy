/*
  Warnings:

  - You are about to drop the column `created_at` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `pharmacists` table. All the data in the column will be lost.
  - You are about to drop the column `expiry_date` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `refills_total` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `refills_used` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `product_batches` table. All the data in the column will be lost.
  - You are about to drop the column `dosage_info` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `expected_date` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `drug_interactions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `pharmacists` will be added. If there are existing duplicate values, this will fail.
  - Made the column `is_default` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `symptoms_input` on table `ai_consultations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ai_analysis` on table `ai_consultations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `brands` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `product_unit_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `cart_id` on table `cart_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `cart_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `cart_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `product_unit_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `order_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_amount` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `pharmacists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `license_no` on table `pharmacists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `approved` on table `pharmacists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `prescriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_url` on table `prescriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `prescriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `batch_number` on table `product_batches` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requires_prescription` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_stock` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loyalty_points` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ai_consultations" DROP CONSTRAINT "ai_consultations_suggested_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ai_consultations" DROP CONSTRAINT "ai_consultations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."drug_interactions" DROP CONSTRAINT "drug_interactions_product_id_a_fkey";

-- DropForeignKey
ALTER TABLE "public"."drug_interactions" DROP CONSTRAINT "drug_interactions_product_id_b_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_prescription_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."pharmacists" DROP CONSTRAINT "pharmacists_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prescriptions" DROP CONSTRAINT "prescriptions_pharmacist_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prescriptions" DROP CONSTRAINT "prescriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_health_profiles" DROP CONSTRAINT "user_health_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "created_at",
DROP COLUMN "postal_code",
ALTER COLUMN "is_default" SET NOT NULL;

-- AlterTable
ALTER TABLE "ai_consultations" ALTER COLUMN "symptoms_input" SET NOT NULL,
ALTER COLUMN "ai_analysis" SET NOT NULL;

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "created_at",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "created_at",
ADD COLUMN     "product_unit_id" INTEGER NOT NULL,
ALTER COLUMN "cart_id" SET NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "created_at",
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "created_at",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "product_unit_id" INTEGER NOT NULL,
ALTER COLUMN "order_id" SET NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total_amount" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "pharmacists" DROP COLUMN "created_at",
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "license_no" SET NOT NULL,
ALTER COLUMN "approved" SET NOT NULL;

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "expiry_date",
DROP COLUMN "refills_total",
DROP COLUMN "refills_used",
DROP COLUMN "remarks",
ADD COLUMN     "admin_note" TEXT,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "image_url" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_batches" DROP COLUMN "updated_at",
ALTER COLUMN "batch_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "dosage_info",
DROP COLUMN "price",
ADD COLUMN     "active_ingredients" TEXT,
ADD COLUMN     "contraindications" TEXT,
ADD COLUMN     "image_url" VARCHAR,
ADD COLUMN     "indications" TEXT,
ADD COLUMN     "usage_instructions" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "requires_prescription" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "total_stock" SET NOT NULL;

-- AlterTable
ALTER TABLE "purchase_orders" DROP COLUMN "expected_date",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "address",
DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "user_health_profiles" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "updated_at",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "loyalty_points" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL;

-- DropTable
DROP TABLE "public"."drug_interactions";

-- DropEnum
DROP TYPE "public"."Severity";

-- CreateTable
CREATE TABLE "product_units" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "unit_name" VARCHAR NOT NULL,
    "conversion_factor" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL NOT NULL,
    "is_base_unit" BOOLEAN NOT NULL DEFAULT false,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacists_user_id_key" ON "pharmacists"("user_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_units" ADD CONSTRAINT "product_units_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_unit_id_fkey" FOREIGN KEY ("product_unit_id") REFERENCES "product_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "product_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_unit_id_fkey" FOREIGN KEY ("product_unit_id") REFERENCES "product_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_health_profiles" ADD CONSTRAINT "user_health_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacists" ADD CONSTRAINT "pharmacists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_pharmacist_id_fkey" FOREIGN KEY ("pharmacist_id") REFERENCES "pharmacists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_consultations" ADD CONSTRAINT "ai_consultations_suggested_product_id_fkey" FOREIGN KEY ("suggested_product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_consultations" ADD CONSTRAINT "ai_consultations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
