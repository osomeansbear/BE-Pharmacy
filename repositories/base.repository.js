const prisma = require("../config/db.js");

class BaseRepository {
  constructor(modelName) {
    if (!modelName || !prisma[modelName]) {
      throw new Error(`Invalid model name: ${modelName}`);
    }
    this.model = prisma[modelName];
  }

  async findAll(filter = {}, include = {}) {
    return this.model.findMany({ where: filter, include });
  }

  async findById(id, include = {}) {
    return this.model.findUnique({
      where: { id: BigInt(id) },
      include,
    });
  }

  async findByField(field, value, include = {}) {
    return this.model.findUnique({
      where: { [field]: value },
      include,
    });
  }

  async create(data) {
    return this.model.create({ data });
  }

  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }

  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  async count(filter = {}) {
    return this.model.count({ where: filter });
  }

  async findOne(filter = {}, include = {}) {
    return this.model.findFirst({ where: filter, include });
  }

  async upsert(where, createData, updateData) {
    return this.model.upsert({
      where,
      create: createData,
      update: updateData,
    });
  }
}

module.exports = BaseRepository;
