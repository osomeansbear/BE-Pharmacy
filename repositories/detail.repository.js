const BaseRepository = require("./base.repository");
const prisma = require("../config/db.js");

class ProductDetailRepository extends BaseRepository {
  constructor() {
    super("ProductDetail");
  }

  async getDetailBySlug(slug) {
    if (!slug) {
      const err = new Error("Product slug is required");
      err.statusCode = 400;
      throw err;
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        detail: true,
        categories: {
          include: {
            category: true,
          },
        },
        unit: {
          orderBy: [{ isDefault: "desc" }, { id: "asc" }],
        },
      },
    });
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    // Check if product is active
    if (!product.isActive) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    // Check if brand is active (if exists)
    if (product.brand && !product.brand.isActive) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    // Check if product has at least one active category
    const hasActiveCategory = product.categories.some((pc) => pc.category.isActive);
    if (!hasActiveCategory) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    const detail = product.detail;

    if (!detail) {
      const err = new Error("Product detail not found");
      err.statusCode = 404;
      throw err;
    }

    return {
      ...product,
      ...detail,
      brand: product.brand,
      units: product.unit,
    };
  }

  async getDetailByProductId(productId) {
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
      include: {
        brand: true,
        detail: true,
        unit: {
          orderBy: [{ isDefault: "desc" }, { id: "asc" }],
        },
      },
    });

    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    if (!product.detail) {
      const err = new Error("Product detail not found");
      err.statusCode = 404;
      throw err;
    }

    return {
      ...product,
      ...product.detail,
      brand: product.brand,
      units: product.unit,
    };
  }

  async upsertByProductId(productId, data) {
    return prisma.productDetail.upsert({
      where: { productId: Number(productId) },
      create: {
        productId: Number(productId),
        ...data,
      },
      update: data,
    });
  }
}
module.exports = new ProductDetailRepository();
