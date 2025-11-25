const BrandRepository = require("../repositories/brand.repository.js");

const brandService = {
  async createBrand(data) {
    const { name, description } = data;
    const existingBrand = await BrandRepository.findByName(name);
    if (existingBrand) {
      throw new Error("Brand with this name already exists");
    }
    const newBrand = await BrandRepository.create({ name, description });
    return {
      ...newBrand,
      id: Number(newBrand.id),
    };
  },

  async getAllBrands() {
    const brands = await BrandRepository.findAll();
    return brands.map((brand) => ({
      ...brand,
      id: Number(brand.id),
    }));
  },

  async getBrandById(id) {
    const brand = await BrandRepository.findById(id);
    if (!brand) {
      throw new Error("Brand not found");
    }
    return {
      ...brand,
      id: Number(brand.id),
    };
  },

  async updateBrand(id, data) {
    const brand = await BrandRepository.findById(id);
    if (!brand) {
      throw new Error("Brand not found");
    }
    const updatedBrand = await BrandRepository.update(id, data);
    return {
      ...updatedBrand,
      id: Number(updatedBrand.id),
    };
  },

  async deleteBrand(id) {
    const brand = await BrandRepository.findById(id);
    if (!brand) {
      throw new Error("Brand not found");
    }
    await BrandRepository.delete(id);
  },
};

module.exports = brandService;
