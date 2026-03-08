const {
  CategoryDetailSchema,
  BaseCategorySchema,
} = require("../validators/output/category.output.validator");

class CategoryMapper {
  static mapToListItem(model) {
    return BaseCategorySchema.parse({
      id: model.id,
      name: model.name,
      slug: model.slug,
      parentId: model.parentId,
    });
  }

  static mapToList(models) {
    return models.map((m) => this.mapToListN(m));
  }

  static mapToListN(model) {
    return CategoryDetailSchema.parse({
      id: model.id,
      name: model.name,
    });
  }
}

module.exports = CategoryMapper;
