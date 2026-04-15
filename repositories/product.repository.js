const BaseRepository = require("./base.repository.js");
const prisma = require("../config/db.js");

class ProductRepository extends BaseRepository {
  constructor() {
    super("Product");
  }

  async findAll(filters = {}) {
    const {
      category,
      brand,
      search,
      requiresRx,
      page: rawPage = 1,
      limit: rawLimit = 50,
    } = filters;
    const page = parseInt(rawPage, 10) || 1;
    const limit = parseInt(rawLimit, 10) || 50;

    const normalizedCategory = category?.trim();
    const normalizedBrand = brand?.trim();
    const normalizedSearch = search?.trim();
    const where = {
      isActive: true,
      AND: [
        {
          OR: [
            { brandId: null },
            { brand: { isActive: true } },
          ],
        },
        {
          categories: {
            some: {
              category: { isActive: true },
            },
          },
        },
      ],
      ...(typeof requiresRx === "boolean" ? { requiresRx } : {}),
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              {
                shortDesc: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
              { slug: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(normalizedBrand
        ? {
            brand: {
              is: {
                isActive: true,
                OR: [
                  { slug: { equals: normalizedBrand, mode: "insensitive" } },
                  { name: { contains: normalizedBrand, mode: "insensitive" } },
                ],
              },
            },
          }
        : {}),
      ...(normalizedCategory
        ? {
            categories: {
              some: {
                category: {
                  isActive: true,
                  OR: [
                    {
                      slug: {
                        equals: normalizedCategory,
                        mode: "insensitive",
                      },
                    },
                    {
                      name: {
                        contains: normalizedCategory,
                        mode: "insensitive",
                      },
                    },
                    {
                      parent: {
                        slug: {
                          equals: normalizedCategory,
                          mode: "insensitive",
                        },
                      },
                    },
                  ],
                },
              },
            },
          }
        : {}),
    };

    return prisma.product.findMany({
      where,
      include: {
        brand: true,
        categories: {
          include: {
            category: true,
          },
        },
        unit: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findBySlug(slug) {
    const product = await this.findByField("slug", slug);

    return product ? { ...product } : null;
  }

  async createUnit(productId, data) {
    return prisma.$transaction(async (tx) => {
      const hasUnits = await tx.productUnit.count({
        where: { productId: Number(productId) },
      });
      const isDefault = data.isDefault ?? hasUnits === 0;

      if (isDefault) {
        await tx.productUnit.updateMany({
          where: { productId: Number(productId) },
          data: { isDefault: false },
        });
      }

      return tx.productUnit.create({
        data: {
          productId: Number(productId),
          unitType: data.unitType,
          price: data.price,
          conversionFactor: data.conversionFactor,
          isDefault,
        },
      });
    });
  }

  async deleteUnit(productId, unitId) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.productUnit.findFirst({
        where: { id: Number(unitId), productId: Number(productId) },
      });

      if (!existing) {
        return null;
      }

      await tx.productUnit.delete({ where: { id: Number(unitId) } });

      if (existing.isDefault) {
        const fallback = await tx.productUnit.findFirst({
          where: { productId: Number(productId) },
          orderBy: { id: "asc" },
        });

        if (fallback) {
          await tx.productUnit.update({
            where: { id: fallback.id },
            data: { isDefault: true },
          });
        }
      }

      return existing;
    });
  }

  async findProductCategory(productId, categoryId) {
    return prisma.productCategory.findUnique({
      where: {
        productId_categoryId: {
          productId: Number(productId),
          categoryId: Number(categoryId),
        },
      },
    });
  }

  async findUnitByProductAndType(productId, unitType, select = null) {
    const query = {
      where: {
        productId: Number(productId),
        unitType,
      },
    };
    if (select) query.select = select;
    return prisma.productUnit.findFirst(query);
  }

  async findManyByIds(ids, select = null) {
    const query = { where: { id: { in: ids } } };
    if (select) query.select = select;
    return this.model.findMany(query);
  }

  async findActiveByIds(ids, select = null) {
    const query = { where: { id: { in: ids }, isActive: true } };
    if (select) query.select = select;
    return this.model.findMany(query);
  }

  async findUnitsByConditions(conditions, select = null) {
    const query = { where: { OR: conditions } };
    if (select) query.select = select;
    return prisma.productUnit.findMany(query);
  }

  async findByChatKeywords(keywords) {
    if (!keywords.length) return [];
    const orConditions = keywords.flatMap((keyword) => [
      { name: { contains: keyword, mode: "insensitive" } },
      { shortDesc: { contains: keyword, mode: "insensitive" } },
      { productAIs: { some: { context: { contains: keyword, mode: "insensitive" } } } },
      { detail: { indications: { contains: keyword, mode: "insensitive" } } },
    ]);
    return this.model.findMany({
      where: {
        requiresRx: false,
        isActive: true,
        AND: [
          {
            OR: [
              { brandId: null },
              { brand: { isActive: true } },
            ],
          },
          {
            categories: {
              some: {
                category: { isActive: true },
              },
            },
          },
        ],
        OR: orConditions,
      },
      include: {
        productAIs: true,
        detail: true,
        unit: { where: { isDefault: true }, take: 1 },
      },
      take: 5,
    });
  }

  async softDelete(id) {
    return this.update(Number(id), { isActive: false });
  }

  async assignCategory(productId, categoryId) {
    return prisma.productCategory.create({
      data: {
        productId: Number(productId),
        categoryId: Number(categoryId),
      },
    });
  }

  async removeCategory(productId, categoryId) {
    return prisma.productCategory.delete({
      where: {
        productId_categoryId: {
          productId: Number(productId),
          categoryId: Number(categoryId),
        },
      },
    });
  }

  async updateUnit(productId, unitId, data) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.productUnit.findFirst({
        where: { id: Number(unitId), productId: Number(productId) },
      });

      if (!existing) {
        return null;
      }

      if (data.isDefault === true) {
        await tx.productUnit.updateMany({
          where: { productId: Number(productId) },
          data: { isDefault: false },
        });
      }

      const updated = await tx.productUnit.update({
        where: { id: Number(unitId) },
        data,
      });

      if (existing.isDefault && data.isDefault === false) {
        const fallback = await tx.productUnit.findFirst({
          where: {
            productId: Number(productId),
            isDefault: true,
          },
        });

        if (!fallback) {
          const nextUnit = await tx.productUnit.findFirst({
            where: {
              productId: Number(productId),
              NOT: { id: Number(unitId) },
            },
            orderBy: { id: "asc" },
          });

          if (nextUnit) {
            await tx.productUnit.update({
              where: { id: nextUnit.id },
              data: { isDefault: true },
            });
          } else {
            return tx.productUnit.update({
              where: { id: Number(unitId) },
              data: { isDefault: true },
            });
          }
        }
      }

      return updated;
    });
  }
}

module.exports = new ProductRepository();
