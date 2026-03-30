const {
  BaseBrandSchema,
  BrandListSchema,
} = require("../validators/output/brand.output.validator.js");

class BrandMapper {
  static mapToItem(model) {
    return BaseBrandSchema.parse({
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description ?? null,
      logoUrl: model.logoUrl ?? null,
    });
  }

  static mapToList(models) {
    return BrandListSchema.parse(models.map((m) => this.mapToItem(m)));
  }
}

module.exports = BrandMapper;
