const ProductDetailRepository = require("../repositories/detail.repository.js");
const ProductRepository = require("../repositories/product.repository.js");
const BrandRepository = require("../repositories/brand.repository.js");
const CategoryRepository = require("../repositories/category.repository.js");
const { convertToSlug } = require("../utils/convertToSlug.js");
const ProductMapper = require("../mappers/product.mapper.js");

class productService {
  async createProduct(data) {
    const { name, brandId, shortDesc, requiresRx, isActive, image } = data;

    const slug = convertToSlug(data.slug) || convertToSlug(name);

    const existing = await ProductRepository.findBySlug(slug);
    if (existing) {
      const err = new Error("Product slug already exists");
      err.statusCode = 400;
      throw err;
    }

    if (brandId !== null && brandId !== undefined) {
      const brand = await BrandRepository.findById(Number(brandId));
      if (!brand) {
        const err = new Error("Brand not found");
        err.statusCode = 400;
        throw err;
      }
    }

    const newProduct = await ProductRepository.create({
      name,
      slug,
      brandId: brandId ?? null,
      shortDesc: shortDesc ?? null,
      requiresRx: requiresRx ?? false,
      isActive: isActive ?? true,
      image: image || [],
    });

    return ProductMapper.mapToItem(newProduct);
  }

  async getProductBySlug(slug) {
    const product = await ProductRepository.findBySlug(slug);
    return product ? ProductMapper.mapToItem(product) : null;
  }

  async getAllProducts(filters = {}) {
    const products = await ProductRepository.findAll(filters);
    return ProductMapper.mapToList(products);
  }

  async getProductDetail(slug) {
    const detail = await ProductDetailRepository.getDetailBySlug(slug);
    return ProductMapper.mapToDetail(detail);
  }

  async updateProduct(id, data) {
    const product = await this.#ensureProductExists(id);
    const nextData = { ...data };

    if (Object.prototype.hasOwnProperty.call(nextData, "brandId")) {
      if (nextData.brandId !== null && nextData.brandId !== undefined) {
        const brand = await BrandRepository.findById(Number(nextData.brandId));
        if (!brand) {
          const err = new Error("Brand not found");
          err.statusCode = 400;
          throw err;
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(nextData, "slug")) {
      nextData.slug = convertToSlug(nextData.slug);
    } else if (Object.prototype.hasOwnProperty.call(nextData, "name")) {
      nextData.slug = convertToSlug(nextData.name);
    }

    if (nextData.slug) {
      const existing = await ProductRepository.findBySlug(nextData.slug);
      if (existing && Number(existing.id) !== Number(product.id)) {
        const err = new Error("Product slug already exists");
        err.statusCode = 400;
        throw err;
      }
    }

    const updated = await ProductRepository.update(Number(id), nextData);
    return ProductMapper.mapToItem(updated);
  }

  async deleteProduct(id) {
    await this.#ensureProductExists(id);
    await ProductRepository.softDelete(id);
  }

  async upsertDetail(productId, data) {
    await this.#ensureProductExists(productId);
    await ProductDetailRepository.upsertByProductId(productId, data);
    const detail =
      await ProductDetailRepository.getDetailByProductId(productId);
    return ProductMapper.mapToDetail(detail);
  }

  async addUnit(productId, data) {
    await this.#ensureProductExists(productId);

    const existingUnit = await ProductRepository.findUnitByProductAndType(
      productId,
      data.unitType,
    );
    if (existingUnit) {
      const err = new Error("Unit type already exists for this product");
      err.statusCode = 400;
      throw err;
    }

    const unit = await ProductRepository.createUnit(productId, data);
    return ProductMapper.mapUnit(unit);
  }

  async updateUnit(productId, unitId, data) {
    await this.#ensureProductExists(productId);

    const updated = await ProductRepository.updateUnit(productId, unitId, data);
    if (!updated) {
      const err = new Error("Product unit not found");
      err.statusCode = 404;
      throw err;
    }

    return ProductMapper.mapUnit(updated);
  }

  async deleteUnit(productId, unitId) {
    await this.#ensureProductExists(productId);

    const deleted = await ProductRepository.deleteUnit(productId, unitId);
    if (!deleted) {
      const err = new Error("Product unit not found");
      err.statusCode = 404;
      throw err;
    }
  }

  async assignCategory(productId, categoryId) {
    await this.#ensureProductExists(productId);

    const category = await CategoryRepository.findById(Number(categoryId));
    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    const existing = await ProductRepository.findProductCategory(
      productId,
      categoryId,
    );
    if (existing) {
      const err = new Error("Category already assigned to product");
      err.statusCode = 400;
      throw err;
    }

    const assignment = await ProductRepository.assignCategory(
      productId,
      categoryId,
    );
    return {
      productId: assignment.productId,
      categoryId: assignment.categoryId,
    };
  }

  async removeCategory(productId, categoryId) {
    await this.#ensureProductExists(productId);

    const existing = await ProductRepository.findProductCategory(
      productId,
      categoryId,
    );
    if (!existing) {
      const err = new Error("Product category assignment not found");
      err.statusCode = 404;
      throw err;
    }

    await ProductRepository.removeCategory(productId, categoryId);
  }

  async #ensureProductExists(id) {
    const product = await ProductRepository.findById(Number(id));
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    return product;
  }
}

module.exports = new productService();
