const CategoryRepository = require("../repositories/category.repository.js");

const categoryService = {
  async createCategory(data) {
    const { name, description } = data;
    const existingCategory = await CategoryRepository.findByName(name);
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }
    const newCategory = await CategoryRepository.create({ name, description });
    return {
      ...newCategory,
      id: Number(newCategory.id),
    };
  },

  async getAllCategories() {
    const categories = await CategoryRepository.findAll();
    return categories.map((category) => ({
      ...category,
      id: Number(category.id),
    }));
  },

  async getCategoryById(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return {
      ...category,
      id: Number(category.id),
    };
  },

  async updateCategory(id, data) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    const updatedCategory = await CategoryRepository.update(id, data);
    return {
      ...updatedCategory,
      id: Number(updatedCategory.id),
    };
  },

  async deleteCategory(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await CategoryRepository.delete(id);
  },
};

module.exports = categoryService;
