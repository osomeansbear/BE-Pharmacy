const CategoryRepository = require("../repositories/category.repository.js");
const { convertToSlug } = require("../utils/convertToSlug.js");
const CategoryMapper = require("../mappers/category.mapper.js");
class CategoryService {
  async createCategory(data) {
    const { name, parentId } = data;
    const slug = convertToSlug(data.slug) || convertToSlug(name);

    const existingCategory = await CategoryRepository.findByName(name);
    if (existingCategory) {
      const error = new Error("Category with this name already exists");
      error.statusCode = 400;
      throw error;
    }

    const newCategory = await CategoryRepository.create({
      name,
      slug,
      parentId,
    });

    return CategoryMapper.mapToItem({
      ...newCategory,
      id: Number(newCategory.id),
    });
  }

  async getAllCategories() {
    const categories = await CategoryRepository.findAll();
    return CategoryMapper.mapToList(categories);
  }

  async getCategoryById(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
    return CategoryMapper.mapToDetail({ ...category, id: Number(category.id) });
  }

  async updateCategory(id, data) {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error("Category not found");

    if (data.name && !data.slug) {
      data.slug = convertToSlug(data.name);
    }

    const updatedCategory = await CategoryRepository.update(id, data);
    return CategoryMapper.mapToItem({
      ...updatedCategory,
      id: Number(updatedCategory.id),
    });
  }

  async deleteCategory(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error("Category not found");
    await CategoryRepository.softDelete(id);
  }
}

module.exports = new CategoryService();
