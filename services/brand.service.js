const BrandRepository = require("../repositories/brand.repository.js");
const BrandMapper = require("../mappers/brand.mapper.js");

const brandService = {
  async createBrand(data) {
    const { name, description, slug } = data;
    const existingBrand = await BrandRepository.findByName(name);
    if (existingBrand) {
      const err = new Error("Brand with this name already exists");
      err.statusCode = 400;
      throw err;
    }
    const newBrand = await BrandRepository.create({ name, slug, description });
    return BrandMapper.mapToItem({
      ...newBrand,
      id: Number(newBrand.id),
    });
  },

  async getAllBrands() {
    const brands = await BrandRepository.findAll();
    return BrandMapper.mapToList(
      brands.map((brand) => ({
        ...brand,
        id: Number(brand.id),
      })),
    );
  },

  async getBrandById(id) {
    const brand = await BrandRepository.findById(id);
    if (!brand) {
      const err = new Error("Brand not found");
      err.statusCode = 404;
      throw err;
    }
    return BrandMapper.mapToItem({
      ...brand,
      id: Number(brand.id),
    });
  },

  async updateBrand(id, data) {
    const brand = await BrandRepository.findById(id);
    if (!brand) {
      const err = new Error("Brand not found");
      err.statusCode = 404;
      throw err;
    }
    const updatedBrand = await BrandRepository.update(id, data);
    return BrandMapper.mapToItem({
      ...updatedBrand,
      id: Number(updatedBrand.id),
    });
  },

  async deleteBrand(id) {
    const brand = await BrandRepository.findById(id);
    if (!brand) {
      const err = new Error("Brand not found");
      err.statusCode = 404;
      throw err;
    }
    await BrandRepository.softDelete(id);
  },
};

module.exports = brandService;
