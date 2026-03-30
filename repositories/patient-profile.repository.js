const BaseRepository = require("./base.repository.js");

class PatientProfileRepository extends BaseRepository {
  constructor() {
    super("patientProfile");
  }

  async findByUserId(userId) {
    return this.model.findUnique({
      where: { userId: Number(userId) },
    });
  }

  async upsertByUserId(userId, data) {
    return this.model.upsert({
      where: { userId: Number(userId) },
      update: {
        allergies: data.allergies ?? "",
        chronicDiseases: data.chronicDiseases ?? "",
        context: data.context ?? "",
      },
      create: {
        userId: Number(userId),
        allergies: data.allergies ?? "",
        chronicDiseases: data.chronicDiseases ?? "",
        context: data.context ?? "",
      },
    });
  }
}

module.exports = new PatientProfileRepository();
