const CategoryRepository = require("../repositories/category.repository.js");
const { convertToSlug } = require("../utils/convertToSlug.js");
class CategoryService {
  /**
   * Format Private Function: Tạo Slug từ Name
   * Dấu # đảm bảo hàm này chỉ có thể gọi nội bộ trong class này.
   */

  async createCategory(data) {
    const { name } = data;

    // Sử dụng private function
    const slug = convertToSlug(data.slug) || convertToSlug(name);

    const existingCategory = await CategoryRepository.findByName(name);
    if (existingCategory) {
      const error = new Error("Category with this name already exists");
      error.statusCode = 400; // Để BaseController bắt được status code
      throw error;
    }

    const newCategory = await CategoryRepository.create({ name, slug });

    return {
      ...newCategory,
      id: Number(newCategory.id),
    };
  }

  async getAllCategories() {
    const categories = await CategoryRepository.findAll();
    // Đảm bảo tất cả ID đều là Number nếu DB trả về String/BigInt
    return categories.map((cat) => ({ ...cat }));
  }

  async getCategoryById(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
    return { ...category, id: Number(category.id) };
  }

  async updateCategory(id, data) {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error("Category not found");

    // Nếu cập nhật tên mà không gửi slug, tự động tạo slug mới
    if (data.name && !data.slug) {
      data.slug = convertToSlug(data.name);
    }

    const updatedCategory = await CategoryRepository.update(id, data);
    return { ...updatedCategory, id: Number(updatedCategory.id) };
  }

  async deleteCategory(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error("Category not found");
    await CategoryRepository.delete(id);
  }
}

// Export một instance duy nhất (Singleton Pattern)
module.exports = new CategoryService();
