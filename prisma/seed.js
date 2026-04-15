const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "./products_seeding1.json");
  console.log(`📂 Reading data from: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error("❌ File products_seeding1.json not found!");
    return;
  }

  let data;
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    data = JSON.parse(rawContent);
    console.log(`✅ Loaded ${data.length} products from JSON.`);
  } catch (err) {
    console.error("❌ JSON parse error:", err.message);
    return;
  }

  // Clean existing product data
  console.log("🧹 Cleaning old product data...");
  try {
    await prisma.productAI.deleteMany({});
    await prisma.productUnit.deleteMany({});
    await prisma.productCategory.deleteMany({});
    await prisma.productDetail.deleteMany({});
    await prisma.product.deleteMany({});
    console.log("✅ Old data cleared.");
  } catch (e) {
    console.warn("⚠️  Cleanup warning (can ignore):", e.message);
  }

  console.log("🚀 Seeding products...");
  let successCount = 0;
  let errorCount = 0;

  for (const [index, item] of data.entries()) {
    try {
      // --- BRAND ---
      const brand = await prisma.brand.upsert({
        where: { slug: item.brand.slug },
        update: { name: item.brand.name },
        create: item.brand,
      });

      // --- CATEGORIES ---
      const { parent, child } = item.category_structure;
      const parentSlug = parent.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const parentCat = await prisma.category.upsert({
        where: { slug: parentSlug },
        update: {},
        create: { name: parent, slug: parentSlug, parentId: null },
      });
      const childSlug = child.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const childCat = await prisma.category.upsert({
        where: { slug: childSlug },
        update: { parentId: parentCat.id },
        create: { name: child, slug: childSlug, parentId: parentCat.id },
      });

      // --- PRODUCT ---
      const product = await prisma.product.upsert({
        where: { slug: item.product.slug },
        update: {
          name: item.product.name,
          brandId: brand.id,
          stock: item.product.stock,
          requiresRx: item.product.requiresRx,
          isActive: item.product.isActive,
          shortDesc: item.product.shortDesc,
          image: item.product.image,
          detail: {
            upsert: { create: item.detail, update: item.detail },
          },
        },
        create: {
          ...item.product,
          brandId: brand.id,
          detail: { create: item.detail },
          categories: {
            create: { category: { connect: { id: childCat.id } } },
          },
        },
      });

      // --- PRODUCT CATEGORY LINK (upsert so re-seeding always re-links) ---
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: { productId: product.id, categoryId: childCat.id },
        },
        update: {},
        create: { productId: product.id, categoryId: childCat.id },
      });

      // --- PRODUCT UNITS ---
      await prisma.productUnit.upsert({
        where: { productId_unitType: { productId: product.id, unitType: "BOX" } },
        update: { price: "120000", isDefault: true },
        create: {
          productId: product.id,
          unitType: "BOX",
          price: "120000",
          conversionFactor: "1",
          isDefault: true,
        },
      });
      await prisma.productUnit.upsert({
        where: { productId_unitType: { productId: product.id, unitType: "TABLET" } },
        update: { price: "15000", isDefault: false },
        create: {
          productId: product.id,
          unitType: "TABLET",
          price: "15000",
          conversionFactor: "1",
          isDefault: false,
        },
      });

      // --- PRODUCT AI CONTEXT ---
      // Build keyword-rich context from product data for chatbot matching
      const contextParts = [
        item.product.name,
        item.product.shortDesc || "",
        item.detail?.indications || "",
        item.detail?.activeIngredients || "",
        item.detail?.description || "",
        child, // category name (e.g. "Pain Reliever", "Antihistamine")
      ]
        .filter(Boolean)
        .join(". ");

      // Delete old AI entry for this product and recreate
      await prisma.productAI.deleteMany({ where: { productId: product.id } });
      await prisma.productAI.create({
        data: {
          productId: product.id,
          context: contextParts,
        },
      });

      process.stdout.write(".");
      successCount++;
    } catch (err) {
      console.error(
        `\n❌ Error at product #${index + 1} (${item.product?.name}):`,
        err.message,
      );
      errorCount++;
    }
  }

  console.log("\n========================================");
  console.log("🎉 SEEDING RESULTS:");
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed:  ${errorCount}`);
  console.log("========================================");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
