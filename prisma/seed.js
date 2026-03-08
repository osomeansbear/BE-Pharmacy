const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  // 1. KIỂM TRA ĐƯỜNG DẪN FILE
  const filePath = path.join(__dirname, "./products_seeding1.json");
  console.log(`📂 Đang đọc file dữ liệu từ: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(
      "❌ LỖI NGHIÊM TRỌNG: Không tìm thấy file products_seeding.json!",
    );
    console.error(
      "👉 Hãy đổi tên file 'products_seeding1.json' thành 'products_seeding.json' và để ở thư mục gốc.",
    );
    return;
  }

  // 2. ĐỌC DỮ LIỆU
  let data;
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    data = JSON.parse(rawContent);
    console.log(`✅ Đã đọc file thành công. Tìm thấy ${data.length} sản phẩm.`);
  } catch (err) {
    console.error(
      "❌ Lỗi khi phân tích file JSON. File có bị lỗi cú pháp không?",
      err.message,
    );
    return;
  }

  // 3. XÓA DỮ LIỆU CŨ
  console.log("🧹 Bắt đầu dọn dẹp dữ liệu cũ...");
  try {
    await prisma.productCategory.deleteMany({});
    await prisma.productDetail.deleteMany({});
    await prisma.product.deleteMany({});
    console.log("✅ Đã xóa sạch dữ liệu cũ.");
  } catch (e) {
    console.warn("⚠️ Cảnh báo xóa dữ liệu (có thể bỏ qua):", e.message);
  }

  // 4. BẮT ĐẦU SEED TỪNG SẢN PHẨM
  console.log("🚀 Bắt đầu thêm sản phẩm vào Database...");
  let successCount = 0;
  let errorCount = 0;

  for (const [index, item] of data.entries()) {
    try {
      // --- A. BRAND ---
      const brand = await prisma.brand.upsert({
        where: { slug: item.brand.slug },
        update: { name: item.brand.name },
        create: item.brand,
      });

      // --- B. CATEGORY ---
      const { parent, child } = item.category_structure;
      // Parent
      const parentSlug = parent.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const parentCat = await prisma.category.upsert({
        where: { slug: parentSlug },
        update: {},
        create: { name: parent, slug: parentSlug, parentId: null },
      });
      // Child
      const childSlug = child.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const childCat = await prisma.category.upsert({
        where: { slug: childSlug },
        update: { parentId: parentCat.id },
        create: { name: child, slug: childSlug, parentId: parentCat.id },
      });

      // --- C. PRODUCT ---
      await prisma.product.upsert({
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
            create: {
              category: { connect: { id: childCat.id } },
            },
          },
        },
      });

      process.stdout.write("."); // Dấu chấm thể hiện tiến độ
      successCount++;
    } catch (err) {
      console.error(
        `\n❌ Lỗi tại sản phẩm #${index + 1} (${item.product.name}):`,
      );
      console.error(`   -> Nguyên nhân: ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n========================================");
  console.log(`🎉 KẾT QUẢ SEEDING:`);
  console.log(`✅ Thành công: ${successCount}`);
  console.log(`❌ Thất bại:   ${errorCount}`);
  console.log("========================================");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi không xác định:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
