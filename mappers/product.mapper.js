const {
  BaseProductSchema,
  ProductDetailSchema,
  ProductListSchema,
} = require("../validators/output/product.output.validator.js");

class ProductMapper {
  static mapUnit(unit) {
    return {
      id: unit.id,
      unitType: unit.unitType,
      unitGroup: Array.isArray(unit.unitGroup) ? unit.unitGroup : [],
      price: unit.price.toString(),
      conversionFactor: unit.conversionFactor.toString(),
      isDefault: Boolean(unit.isDefault),
    };
  }

  static mapToItem(model) {
    return BaseProductSchema.parse({
      id: model.id,
      name: model.name,
      slug: model.slug,
      brandId: model.brandId ?? null,
      brandName: model.brand?.name ?? null,
      stock: Number(model.stock),
      requiresRx: Boolean(model.requiresRx),
      isActive: Boolean(model.isActive),
      shortDesc: model.shortDesc ?? null,
      image: model.image || [],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      units: Array.isArray(model.unit)
        ? model.unit.map((u) => this.mapUnit(u))
        : [],
      categoryIds: Array.isArray(model.categories)
        ? model.categories.map((pc) => pc.categoryId)
        : [],
    });
  }

  static mapToList(models) {
    return ProductListSchema.parse(models.map((m) => this.mapToItem(m)));
  }

  static mapToDetail(model) {
    return ProductDetailSchema.parse({
      ...this.mapToItem(model),
      productId: model.productId,
      description: model.description ?? null,
      ingredients: model.ingredients ?? null,
      usage: model.usage ?? null,
      storageCondition: model.storageCondition ?? null,
      warnings: model.warnings ?? null,
      seoTitle: model.seoTitle ?? null,
      seoDescription: model.seoDescription ?? null,
      registrationNumber: model.registrationNumber ?? null,
      manufacturer: model.manufacturer ?? null,
      origin: model.origin ?? null,
      dosageForm: model.dosageForm ?? null,
      packaging: model.packaging ?? null,
      activeIngredients: model.activeIngredients ?? null,
      composition: model.composition ?? null,
      indications: model.indications ?? null,
      contraindications: model.contraindications ?? null,
      sideEffects: model.sideEffects ?? null,
      interactions: model.interactions ?? null,
      overdose: model.overdose ?? null,
      pharmacology: model.pharmacology ?? null,
      pregnancyLactation: model.pregnancyLactation ?? null,
      brand: model.brand || null,
      units: Array.isArray(model.units)
        ? model.units.map((unit) => this.mapUnit(unit))
        : [],
    });
  }
}

module.exports = ProductMapper;
